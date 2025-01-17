import * as React from "react";
import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import { DateCalendar } from "@mui/x-date-pickers/DateCalendar";
import { Typography } from "@mui/material";
import dayjs from "dayjs";

export default function BasicDateCalendar() {
  const handleDateChange = (newDate) => {
    console.log("Selected date:", newDate.format("YYYY-MM-DD"));
  };

  // useEffect(() => {
  //   const renderDay = (date, selectedDate, dayInCurrentMonth, dayComponent) => {
  //     const specificDate = dayjs("2025-01-25");

  //     if (dayInCurrentMonth && date.isSame(specificDate, "day")) {
  //       return React.cloneElement(dayComponent, {
  //         style: { backgroundColor: "lightblue", color: "white" },
  //       });
  //     }
  //     return dayComponent;
  //   };
  // }, []);

  return (
    <LocalizationProvider dateAdapter={AdapterDayjs}>
      <DateCalendar onChange={handleDateChange} />
    </LocalizationProvider>
  );
}
