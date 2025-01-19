import React from "react";
import "./Timeline.css";
import Card from "./card.jsx";

export default function OverlappingTimeline(props) {
  const events = props.data;
  function return_hours(time) {
    const [hour, minutes, seconds] = time.split(":").map(Number);
    return parseInt(hour) + minutes / 60;
  }

  function return_time(hour) {
    let hour_comp = parseInt(hour);
    let min_comp = parseInt((hour - hour_comp) * 60);
    return `${hour_comp}:${min_comp}`;
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
  console.log("Updated Events :", updatedEvents);

  return (
    <div className="timeline-container">
      <div className="hours-row">
        {Array.from({ length: 24 }, (_, i) => (
          <div className="hour-cell" key={i}>
            {i}
          </div>
        ))}
      </div>
      {nLevels.map((updatedEvents, levelIndex) => (
        <div className="events-row" style={{ top: `${levelIndex * 50}px` }}>
          {updatedEvents.map((event, eventIndex) => (
            <Card
              style={{
                left: `${(event.schedule_from / 24) * 100}%`,
                width: `${
                  ((event.schedule_to - event.schedule_from) / 24) * 100
                }%`,
                backgroundColor: "lightgreen",
              }}
              username={event.username}
              schedule_from={return_time(event.schedule_from)}
              schedule_to={return_time(event.schedule_to)}
            />
          ))}
        </div>
      ))}

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
