import * as React from "react";
import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import { DateCalendar } from "@mui/x-date-pickers/DateCalendar";
import { Typography } from "@mui/material";

export default function BasicDateCalendar() {
  const handleDateChange = (newDate) => {
    console.log("Selected date:", newDate.format("YYYY-MM-DD"));
  };
  return (
    <LocalizationProvider dateAdapter={AdapterDayjs}>
      <DateCalendar onChange={handleDateChange} />
    </LocalizationProvider>
  );
}