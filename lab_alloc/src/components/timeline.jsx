import React from "react";
import "./Timeline.css";
import Card from "./card.jsx";

export default function OverlappingTimeline(props) {
  const events = props.data;
  function return_hours(time) {
    const [hour, minutes, seconds] = time.split(":").map(Number);
    return parseInt(hour) + minutes / 60;
  }
  const updatedEvents = events.map((event) => {
    return {
      ...event,
      schedule_from: return_hours(event.schedule_from),
      schedule_to: return_hours(event.schedule_to),
    };
  });

  console.log("Updated Events :", updatedEvents);
  updatedEvents.forEach((event) => {
    console.log(
      `Duration ${((event.schedule_to - event.schedule_from) / 24) * 100}`
    );
  });
  return (
    <div className="timeline-container">
      <div className="hours-row">
        {Array.from({ length: 24 }, (_, i) => (
          <div className="hour-cell" key={i}>
            {i}
          </div>
        ))}
      </div>
      <div className="events-row">
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
      </div>
    </div>
  );
}
