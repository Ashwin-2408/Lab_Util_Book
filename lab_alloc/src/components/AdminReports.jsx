import { useState } from "react";
import styled from "styled-components";
import NavBar from "./navbar.jsx";
import { Bar, Pie } from "react-chartjs-2";
import "chart.js/auto"; 
import { jsPDF } from "jspdf"; 
import Papa from "papaparse"; 

const ReportsContainer = styled.div`
  padding: 20px;
  max-width: 1000px;
  margin: auto;
  font-family: "Roboto", sans-serif;
  margin-top: 80px;
`;

const Title = styled.h2`
  text-align: center;
  font-size: 2rem;
  font-weight: 600;
  font-family: "Poppins", sans-serif;
  color: #333;
  margin-bottom: 20px;
`;

const Section = styled.div`
  margin: 20px 0;
`;

const Button = styled.button`
  padding: 10px 15px;
  font-size: 1rem;
  border: none;
  cursor: pointer;
  border-radius: 5px;
  font-weight: 500;
  margin-right: 10px;
  transition: background 0.3s ease;

  ${(props) =>
    props.primary
      ? `background-color: #007bff; color: white;`
      : `background-color: #28a745; color: white;`}

  &:hover {
    opacity: 0.8;
  }
`;

const FiltersContainer = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  background: #f8f9fa;
  padding: 15px;
  border-radius: 8px;
  margin-bottom: 20px;
`;

const FilterLabel = styled.label`
  font-size: 1rem;
  font-weight: 500;
  color: #333;
`;

const FilterSelect = styled.select`
  padding: 8px;
  font-size: 1rem;
  border: 1px solid #ccc;
  border-radius: 5px;
`;

const FilterInput = styled.input`
  padding: 8px;
  font-size: 1rem;
  border: 1px solid #ccc;
  border-radius: 5px;
`;

// Mock Data for Reports
const allCancellations = [
  { id: 1, user: "Alice", lab: "Physics Lab", date: "2025-03-01", reason: "No Show", time: "10:00 AM" },
  { id: 2, user: "Bob", lab: "AI Lab", date: "2025-03-02", reason: "Personal Issue", time: "2:00 PM" },
  { id: 3, user: "Charlie", lab: "Chemistry Lab", date: "2025-03-05", reason: "Lab Maintenance", time: "1:00 PM" },
  { id: 4, user: "Alice", lab: "AI Lab", date: "2025-03-07", reason: "No Show", time: "11:00 AM" },
  { id: 5, user: "Bob", lab: "Physics Lab", date: "2025-03-10", reason: "Equipment Failure", time: "4:00 PM" },
];

const users = ["All Users", "Alice", "Bob", "Charlie"];

export default function AdminReports() {
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");
  const [selectedUser, setSelectedUser] = useState("All Users");

  // Filter cancellations based on user & date range
  const filteredCancellations = allCancellations.filter((c) => {
    const inDateRange =
      (!startDate || new Date(c.date) >= new Date(startDate)) &&
      (!endDate || new Date(c.date) <= new Date(endDate));
    const userMatch = selectedUser === "All Users" || c.user === selectedUser;
    return inDateRange && userMatch;
  });

  // Generate insights
  const cancellationReasons = filteredCancellations.reduce((acc, { reason }) => {
    acc[reason] = (acc[reason] || 0) + 1;
    return acc;
  }, {});

  const peakTimes = filteredCancellations.reduce((acc, { time }) => {
    acc[time] = (acc[time] || 0) + 1;
    return acc;
  }, {});

  // Convert to array format for charts
  const reasonLabels = Object.keys(cancellationReasons);
  const reasonCounts = Object.values(cancellationReasons);
  const timeLabels = Object.keys(peakTimes);
  const timeCounts = Object.values(peakTimes);

  // Function to export CSV
  const exportCSV = () => {
    const csvData = Papa.unparse(filteredCancellations);
    const blob = new Blob([csvData], { type: "text/csv;charset=utf-8;" });
    const link = document.createElement("a");
    link.href = URL.createObjectURL(blob);
    link.setAttribute("download", "cancellation_report.csv");
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  // Function to export PDF
  const exportPDF = () => {
    const doc = new jsPDF();
    doc.text("Cancellation Report", 10, 10);
    filteredCancellations.forEach((c, index) => {
      doc.text(`${index + 1}. ${c.user} | ${c.lab} | ${c.date} | ${c.reason} | ${c.time}`, 10, 20 + index * 10);
    });
    doc.save("cancellation_report.pdf");
  };

  return (
    <>
      <NavBar />
      <ReportsContainer>
        <Title>Reports & Analytics</Title>

        {/* Filters Section */}
        <FiltersContainer>
          <div>
            <FilterLabel>Date Range: </FilterLabel>
            <FilterInput type="date" value={startDate} onChange={(e) => setStartDate(e.target.value)} />
            <FilterInput type="date" value={endDate} onChange={(e) => setEndDate(e.target.value)} />
          </div>

          <div>
            <FilterLabel>User: </FilterLabel>
            <FilterSelect value={selectedUser} onChange={(e) => setSelectedUser(e.target.value)}>
              {users.map((user) => (
                <option key={user} value={user}>
                  {user}
                </option>
              ))}
            </FilterSelect>
          </div>
        </FiltersContainer>

        {/* Export Buttons */}
        <Section>
          <Button primary onClick={exportCSV}>Export CSV</Button>
          <Button onClick={exportPDF}>Export PDF</Button>
        </Section>

        {/* 📊 Cancellation Reasons Breakdown */}
        <Section>
          <h3>Cancellation Reasons</h3>
          <Bar
            data={{
              labels: reasonLabels,
              datasets: [
                {
                  label: "Cancellations",
                  data: reasonCounts,
                  backgroundColor: "rgba(75, 192, 192, 0.6)",
                },
              ],
            }}
          />
        </Section>

        {/* 📊 Peak Cancellation Times (Smaller Pie Chart) */}
        <Section>
          <h3>Peak Cancellation Times</h3>
          <Pie
            data={{
              labels: timeLabels,
              datasets: [
                {
                  label: "Peak Times",
                  data: timeCounts,
                  backgroundColor: ["#FF6384", "#36A2EB", "#FFCE56", "#4BC0C0"],
                },
              ],
            }}
            options={{
              responsive: true,
              maintainAspectRatio: false,
              plugins: { legend: { position: "bottom" } },
            }}
            style={{ maxHeight: "300px", maxWidth: "300px", margin: "auto" }}
          />
        </Section>
      </ReportsContainer>
    </>
  );
}
