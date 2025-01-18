import * as React from "react";
import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import { DateCalendar } from "@mui/x-date-pickers/DateCalendar";
import { Typography } from "@mui/material";
import dayjs from "dayjs";

export default function BasicDateCalendar(props) {
  const handleDateChange = (newDate) => {
    console.log("Selected date:", newDate.format("YYYY-MM-DD"));
    console.log("Month : ", newDate.getMonth() + 1);
    props.setCurMonth(() => newDate.getMonth() + 1);
  };

  return (
    <LocalizationProvider dateAdapter={AdapterDayjs}>
      <DateCalendar onChange={handleDateChange} />
    </LocalizationProvider>
  );
}
