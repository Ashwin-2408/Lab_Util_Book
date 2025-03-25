import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import axios from 'axios';
import WaitList from './components/WaitList';


vi.mock('axios');

describe('WaitList Component', () => {
  const mockLabs = [
    {
      lab_id: 1,
      lab_name: 'Computer Lab A',
      total_systems: 10,
      available_systems: 5
    }
  ];

  const originalMockWaitlist = [
    { user_name: 'John Doe' },
    { user_name: 'Jane Smith' }
  ];

  beforeEach(() => {
    vi.resetAllMocks();
  });

  const setupLabSelection = async () => {
    axios.get
      .mockResolvedValueOnce({ data: mockLabs })
      .mockResolvedValueOnce({ data: originalMockWaitlist });

    render(<WaitList />);

    await waitFor(() => {
      const labCard = screen.getByText('Computer Lab A');
      fireEvent.click(labCard);
    });

    const nameInput = screen.getByPlaceholderText('Enter your name');
    fireEvent.change(nameInput, { target: { value: 'Test User' } });
  };

  it('joins and leaves waitlist', async () => {
    const mockWaitlistAfterJoin = [
      ...originalMockWaitlist, 
      { user_name: 'Test User' }
    ];

    axios.post.mockResolvedValueOnce({});
    axios.get
      .mockResolvedValueOnce({ data: mockLabs })
      .mockResolvedValueOnce({ data: originalMockWaitlist })
      .mockResolvedValueOnce({ data: mockWaitlistAfterJoin })
      .mockResolvedValueOnce({ data: mockLabs })
      .mockResolvedValueOnce({ data: originalMockWaitlist });
    axios.delete.mockResolvedValueOnce({});

    await setupLabSelection();

    const joinButton = screen.getByText('Join Waitlist');
    fireEvent.click(joinButton);

    await waitFor(() => {
      const waitlistUsers = screen.getAllByText('Lab access ready soon');
      expect(waitlistUsers.length).toBeGreaterThanOrEqual(2);
    });

    const leaveButton = screen.getByText('Leave Waitlist');
    fireEvent.click(leaveButton);

    await waitFor(() => {
      const waitlistUsers = screen.getAllByText('Lab access ready soon');
      expect(waitlistUsers.length).toBe(1);
    });
  });

  it('prevents joining waitlist without a name', async () => {
    await setupLabSelection();

    const nameInput = screen.getByPlaceholderText('Enter your name');
    fireEvent.change(nameInput, { target: { value: '' } });

    const joinButton = screen.getByText('Join Waitlist');
    fireEvent.click(joinButton);
    expect(axios.post).not.toHaveBeenCalled();
  });
});