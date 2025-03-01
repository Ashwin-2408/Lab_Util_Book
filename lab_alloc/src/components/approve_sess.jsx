import { LuFilter } from "react-icons/lu";
import { BiSortAlt2 } from "react-icons/bi";
import { RxShare2 } from "react-icons/rx";
import { LiaPaletteSolid } from "react-icons/lia";
import { BiHide } from "react-icons/bi";
import { LuUser } from "react-icons/lu";
import { FiMessageSquare } from "react-icons/fi";
import { GoDotFill } from "react-icons/go";
import { SiNamebase } from "react-icons/si";
import { useEffect, useState } from "react";
import ApprovePopUp from "./approve_popup";
import axios from "axios";
import { PropaneSharp } from "@mui/icons-material";

export default function Approve() {
  const [reqData, setReqData] = useState([]);
  const [popUp, setPopUp] = useState(false);
  const [selectedRequest, setSelectedRequest] = useState(null);

  useEffect(() => {
    if (popUp == false) {
      axios
        .get("http://127.0.0.1:8000/api/schedule_req")
        .then((response) => {
          setReqData(response.data);
          console.log("Data : ", response.data);
        })
        .catch((error) =>
          console.log("Error while fetching Schedule_Request", error)
        );
    }
  }, [popUp]);

  function handleStatus(value) {
    setSelectedRequest(value);
    setPopUp(true);
  }

  function handleApproval(acceptance, session_id) {
    axios
      .patch(`http://127.0.0.1:8000/api/schedule_req/${session_id}/`, {
        status: acceptance,
        approved_by: "admin1",
      })
      .then((response) => {
        closePopup();
        console.log(response.data);
      })
      .catch((error) => console.log("Error while approval", error));
  }

  function closePopup() {
    setPopUp(false);
    setSelectedRequest(null);
  }

  return (
    <div style={{ margin: "1rem" }}>
      <div className={`approve-container ${popUp ? "blurred" : ""}`}>
        <div className="tools">
          <button className="tool-div">
            <div>
              <LuFilter />
            </div>
            <div className="tool-label">Filter</div>
          </button>
          <button className="tool-div">
            <div>
              <BiSortAlt2 />
            </div>
            <div className="tool-label">Sort</div>
          </button>
          <button className="tool-div">
            <div>
              <RxShare2 />
            </div>
            <div className="tool-label">Share view</div>
          </button>
          <button className="tool-div">
            <div>
              <LiaPaletteSolid />
            </div>
            <div className="tool-label">Color</div>
          </button>
          <button className="tool-div">
            <div>
              <BiHide />
            </div>
            <div className="tool-label">Hide fields</div>
          </button>
        </div>

        <div className="approve-body">
          <div className="header-div">
            <div className="header-div-cell">
              <SiNamebase /> Name
            </div>
            <div className="header-div-cell">
              <LuUser /> Assignee
            </div>
            <div className="header-div-cell">
              <FiMessageSquare /> Status
            </div>
          </div>

          <div className="body-div">
            {reqData.map((elem, index) => (
              <div className="body-div-outer" key={index}>
                <div className="body-div-cell">{elem.username}</div>
                <div className="body-div-cell">
                  <div className="assignee-icon">
                    {elem.approved_by.charAt(0).toUpperCase()}
                  </div>
                  <div>{elem.approved_by ? elem.approved_by : "None"}</div>
                </div>
                <div
                  className="body-div-cell"
                  onClick={() => handleStatus(elem)}
                >
                  <div className="body-status-div">
                    <GoDotFill className={`status-icon ${elem.status}`} />
                    <span className={`status-text ${elem.status}`}>
                      {elem.status}
                    </span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
      {popUp && (
        <ApprovePopUp
          data={selectedRequest}
          closePopup={closePopup}
          handleApproval={handleApproval}
        />
      )}
    </div>
  );
}
