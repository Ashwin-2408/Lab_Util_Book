import { DiAtom } from "react-icons/di";
export default function Card(props) {
  return (
    <div className={`event-card-outer ${props.classname}`} style={props.style}>
      <div className="event-card">
        <div>
          <DiAtom style={{ fontSize: "1.5rem" }} />
        </div>
        <div className="event-card-body">
          <div style={{ fontWeight: "500" }}>{props.username}</div>
          <div style={{ fontSize: "0.7rem" }}>
            {props.schedule_from} - {props.schedule_to}
          </div>
        </div>
      </div>
    </div>
  );
}
