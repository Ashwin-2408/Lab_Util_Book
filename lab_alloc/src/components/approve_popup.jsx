import { FiUser } from "react-icons/fi";
import { GiBubblingFlask } from "react-icons/gi";
import { BsClock } from "react-icons/bs";
import { BsCalendar4Week } from "react-icons/bs";
import { BsArrowRight } from "react-icons/bs";
import * as React from "react";
import Button from "@mui/material/Button";
import { FiMessageSquare } from "react-icons/fi";
import { IoClose } from "react-icons/io5";

export default function ApprovePopUp(props) {
  return (
    <div className="approve-popup-outer">
      <div className="popup-close-btn" onClick={props.closePopup}>
        <IoClose />
      </div>
      <div
        style={{
          margin: "1rem",
          display: "flex",
          flexDirection: "column",
          gap: "1rem",
        }}
      >
        <div className="popup-content-sec">
          <div className="popup-icon">
            <FiUser />
          </div>
          <div className="approve-popup-content">{props.data.username}</div>
        </div>
        <div className="popup-content-sec">
          <div className="popup-icon">
            <GiBubblingFlask />
          </div>
          <div className="approve-popup-content">Quantum Lab</div>
        </div>
        <div className="popup-content-sec">
          <div className="popup-icon">
            <BsClock />
          </div>
          <div style={{ display: "flex", alignItems: "center", gap: "1rem" }}>
            <div className="approve-popup-content">
              <div style={{ width: "5rem" }}>{props.data.schedule_date}</div>
              <div>
                <BsCalendar4Week />
              </div>
            </div>
            <div className="approve-popup-content">
              {props.data.schedule_from}
            </div>
            <div>
              <BsArrowRight />
            </div>
            <div className="approve-popup-content">
              <div style={{ width: "5rem" }}>{props.data.schedule_date}</div>
              <div>
                <BsCalendar4Week />
              </div>
            </div>
            <div className="approve-popup-content">
              {props.data.schedule_to}
            </div>
          </div>
        </div>
        <div className="popup-content-sec">
          <div className="popup-icon">
            <FiMessageSquare />
          </div>
          <div className="approve-popup-content">{props.data.status}</div>
        </div>
        <div className="popup-content-sec">
          <div className="popup-icon">
            <FiUser />
          </div>
          <div className="approve-popup-content">{props.data.approved_by}</div>
        </div>
        <div style={{ display: "flex", gap: "1rem" }}>
          <Button
            variant="outlined"
            style={{
              height: "2rem",
              color: "white",
              borderColor: "white",
              textTransform: "Capitalize",
            }}
            onClick={() => props.handleApproval("accept", props.data.id)}
          >
            Approve
          </Button>
          <Button
            variant="outlined"
            style={{
              height: "2rem",
              color: "white",
              borderColor: "white",
              textTransform: "Capitalize",
            }}
            onClick={() => props.handleApproval("reject", props.data.id)}
          >
            Reject
          </Button>
        </div>
      </div>
    </div>
  );
}
