import React from "react";
import "./Timeline.css";
import Card from "./card.jsx";
import { useRef, useEffect, useState } from "react";

export default function OverlappingTimeline(props) {
  const divRef = useRef(null);
  const [hourCellWidth, setHourCellWidth] = useState(null);

  useEffect(() => {
    if (divRef.current) {
      const width = divRef.current.getBoundingClientRect();
      setHourCellWidth((prevState) => width.width.toFixed(2));
    }
  }, []);

  const events = props.data;
  function return_hours(time) {
    const [hour, minutes, seconds] = time.split(":").map(Number);
    return parseInt(hour) + minutes / 60;
  }

  function format_cal(event_time) {
    const options = {
      hour: "2-digit",
      minute: "2-digit",
      hour12: false,
      timeZone: "Asia/Kolkata",
    };
    const formatter = new Intl.DateTimeFormat("en-IN", options);
    return formatter.format(new Date(event_time));
  }

  function return_time(hour) {
    let hour_comp = parseInt(hour);
    let min_comp = parseInt((hour - hour_comp) * 60);
    return `${hour_comp}:${min_comp}`;
  }

  function format_cal_return(event_time) {
    const onlyTime = format_cal(event_time);
    const hours = return_hours(onlyTime + ":00");
    return hours;
  }

  function getStatusClass(status) {
    if (status === null) return "upcoming";
    if (status === "Completed") return "completed";
    if (status === "In Progress") return "inprogress";
    return "blocked";
  }

  const updatedEvents = events.map((event) => {
    return {
      ...event,
      schedule_from: return_hours(event.schedule_from),
      schedule_to: return_hours(event.schedule_to),
    };
  });

  function developLevels() {
    updatedEvents.sort((a, b) => a.schedule_from - b.schedule_from);
    let levels = [];
    for (let i = 0; i < updatedEvents.length; i++) {
      let flag = true;
      for (let j = 0; j < levels.length; j++) {
        if (
          levels[j][levels[j].length - 1].schedule_to <=
          updatedEvents[i].schedule_from
        ) {
          levels[j].push(updatedEvents[i]);
          flag = false;
          break;
        }
      }
      if (flag) {
        levels.push([updatedEvents[i]]);
      }
    }
    return levels;
  }

  const nLevels = developLevels();

  return (
    <div className="timeline-container">
      <div className="hours-row">
        {Array.from({ length: 24 }, (_, i) => (
          <div className="hour-cell" key={i} ref={divRef}>
            {i}
          </div>
        ))}
      </div>
      {nLevels.map((updatedEvents, levelIndex) => (
        <div className="events-row" style={{ top: `${levelIndex * 45}px` }}>
          {updatedEvents.map((event, eventIndex) => (
            <Card
              style={{
                left: `${event.schedule_from * hourCellWidth}px`,
                width: `${
                  (event.schedule_to - event.schedule_from) * hourCellWidth
                }px`,
              }}
              classname={
                props.toggleState ? "toggle-true" : getStatusClass(event.status)
              }
              username={event.username}
              schedule_from={return_time(event.schedule_from)}
              schedule_to={return_time(event.schedule_to)}
            />
          ))}
        </div>
      ))}
      {props.mainData.map((event, _) => (
        <div
          className="mask"
          style={{
            left: `${return_hours(event.start_time) * hourCellWidth}px`,
            width: `${
              (return_hours(event.end_time) - return_hours(event.start_time)) *
              hourCellWidth
            }px`,
          }}
        >
          Maintainence Period
        </div>
      ))}
      {props.toggleState && (
        <div className="events-row">
          {props.calendarEvents.map((elem) => (
            <Card
              style={{
                left: `${
                  format_cal_return(elem.start.dateTime) * hourCellWidth
                }px`,
                width: `${
                  (format_cal_return(elem.end.dateTime) -
                    format_cal_return(elem.start.dateTime)) *
                  hourCellWidth
                }px`,
                background: "rgb(224, 177, 162)",
                color: "black",
                borderLeft: "#FFF",
              }}
              username={elem.summary}
              schedule_from={format_cal(elem.start.dateTime)}
              schedule_to={format_cal(elem.end.dateTime)}
            />
          ))}
        </div>
      )}
      {/* <div className="events-row">
        {updatedEvents.map((event, index) => (
          <Card
            style={{
              left: `${(event.schedule_from / 24) * 100}%`,
              width: `${
                ((event.schedule_to - event.schedule_from) / 24) * 100
              }%`,
              // top: `${event.rowStep * 40}px`,
              backgroundColor: "lightgreen",
            }}
            username={events[index].username}
            schedule_from={events[index].schedule_from}
            schedule_to={events[index].schedule_to}
          />
        ))}
      </div> */}
    </div>
  );
}
