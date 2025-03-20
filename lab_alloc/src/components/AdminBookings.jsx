import { useState } from "react";
import { Trash2, AlertCircle } from "lucide-react";
import styled from "styled-components";
import NavBar from "./navbar.jsx"; // ✅ Importing NavBar

// Styled Components
const AdminBookingsContainer = styled.div`
  padding: 20px;
  max-width: 1000px;
  margin: auto;
  font-family: "Roboto", sans-serif;
  margin-top: 80px; /* ✅ Prevents overlap with navbar */
`;

const Title = styled.h2`
  text-align: center;
  font-size: 2rem;
  font-weight: 600;
  font-family: "Poppins", sans-serif;
  color: #333;
  margin-bottom: 20px;
`;

const BookingsTable = styled.table`
  width: 100%;
  border-collapse: collapse;
  background: white;
  border-radius: 8px;
  overflow: hidden;
  box-shadow: 0px 4px 8px rgba(0, 0, 0, 0.1);
`;

const TableHeader = styled.th`
  padding: 15px;
  border-bottom: 2px solid #ddd;
  background: #f4f4f4;
  font-weight: 600;
  text-transform: uppercase;
  color: #444;
`;

const TableRow = styled.tr`
  &:nth-child(even) {
    background: #f9f9f9;
  }
`;

const TableCell = styled.td`
  padding: 15px;
  text-align: left;
  border-bottom: 1px solid #ddd;
  font-size: 1rem;
  color: #555;
`;

const CancelButton = styled.button`
  background: transparent;
  border: none;
  color: red;
  font-weight: bold;
  font-size: 1rem;
  cursor: ${(props) => (props.disabled ? "not-allowed" : "pointer")};
  display: flex;
  align-items: center;
  gap: 5px;
  transition: color 0.3s ease;
  opacity: ${(props) => (props.disabled ? 0.5 : 1)};

  &:hover {
    color: ${(props) => (props.disabled ? "red" : "darkred")};
  }
`;

const ViolationTag = styled.span`
  background-color: ${(props) => (props.violated ? "#ffcccc" : "#e0f7fa")};
  color: ${(props) => (props.violated ? "red" : "green")};
  padding: 5px 10px;
  font-size: 0.9rem;
  border-radius: 5px;
  font-weight: 500;
`;

// Styled Modal
const ModalOverlay = styled.div`
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background: rgba(0, 0, 0, 0.5);
  display: flex;
  justify-content: center;
  align-items: center;
`;

const ModalContent = styled.div`
  background: white;
  padding: 25px;
  border-radius: 10px;
  text-align: center;
  box-shadow: 0px 5px 15px rgba(0, 0, 0, 0.3);
`;

const ModalTitle = styled.h3`
  font-size: 1.5rem;
  margin-bottom: 15px;
  font-weight: 600;
  color: #333;
`;

const ModalButtons = styled.div`
  display: flex;
  justify-content: space-around;
  margin-top: 15px;
`;

const ConfirmCancel = styled.button`
  background-color: red;
  color: white;
  padding: 10px 15px;
  border: none;
  cursor: pointer;
  border-radius: 5px;
  font-weight: 500;
  transition: background 0.3s ease;

  &:hover {
    background: darkred;
  }
`;

const CloseButton = styled.button`
  background-color: gray;
  color: white;
  padding: 10px 15px;
  border: none;
  cursor: pointer;
  border-radius: 5px;
  font-weight: 500;
  transition: background 0.3s ease;

  &:hover {
    background: #545b62;
  }
`;

const SelectReason = styled.select`
  width: 100%;
  padding: 8px;
  margin-top: 10px;
  border-radius: 5px;
  font-size: 1rem;
  border: 1px solid #ccc;
`;

// Mock Data - Some Users Violating Policies
const bookingsData = [
  { id: 1, user: "Alice", lab: "Physics Lab", time: "10:00 AM - 12:00 PM", violation: true },
  { id: 2, user: "Bob", lab: "Chemistry Lab", time: "1:00 PM - 3:00 PM", violation: false },
  { id: 3, user: "Charlie", lab: "AI Lab", time: "3:00 PM - 5:00 PM", violation: true },
];

export default function AdminBookings() {
  const [bookings, setBookings] = useState(bookingsData);
  const [selectedBooking, setSelectedBooking] = useState(null);
  const [showModal, setShowModal] = useState(false);
  const [cancelReason, setCancelReason] = useState("");

  function handleCancelBooking(id) {
    if (!cancelReason) return;
    setBookings(bookings.filter((booking) => booking.id !== id));
    setShowModal(false);
    setCancelReason("");
  }

  return (
    <>
      <NavBar />
      <AdminBookingsContainer>
        <Title>Admin - Cancellation Management</Title>
        <BookingsTable>
          <thead>
            <tr>
              <TableHeader>User</TableHeader>
              <TableHeader>Lab</TableHeader>
              <TableHeader>Time</TableHeader>
              <TableHeader>Violation</TableHeader>
              <TableHeader>Action</TableHeader>
            </tr>
          </thead>
          <tbody>
            {bookings.map((booking) => (
              <TableRow key={booking.id}>
                <TableCell>{booking.user}</TableCell>
                <TableCell>{booking.lab}</TableCell>
                <TableCell>{booking.time}</TableCell>
                <TableCell>
                  <ViolationTag violated={booking.violation}>
                    {booking.violation ? "Policy Violated" : "No Violation"}
                  </ViolationTag>
                </TableCell>
                <TableCell>
                  <CancelButton
                    onClick={() => {
                      setSelectedBooking(booking);
                      setShowModal(true);
                    }}
                  >
                    <Trash2 size={18} />
                    Cancel
                  </CancelButton>
                </TableCell>
              </TableRow>
            ))}
          </tbody>
        </BookingsTable>

        {showModal && (
          <ModalOverlay>
            <ModalContent>
              <ModalTitle>Reason for Cancellation</ModalTitle>
              <SelectReason onChange={(e) => setCancelReason(e.target.value)}>
                <option value="">Select a reason</option>
                <option value="Policy Violation">Policy Violation</option>
                <option value="Equipment Failure">Equipment Failure</option>
                <option value="Lab Maintenance">Lab Maintenance</option>
                <option value="University Event">University Event</option>
              </SelectReason>
              <ModalButtons>
                <ConfirmCancel disabled={!cancelReason} onClick={() => handleCancelBooking(selectedBooking.id)}>
                  Yes, Cancel
                </ConfirmCancel>
                <CloseButton onClick={() => setShowModal(false)}>No, Keep It</CloseButton>
              </ModalButtons>
            </ModalContent>
          </ModalOverlay>
        )}
      </AdminBookingsContainer>
    </>
  );
}
