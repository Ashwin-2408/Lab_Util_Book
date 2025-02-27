import ApproveDiv from "./approve_div";
import { useState, useEffect } from "react";
import axios from "axios";
export default function Approve() {
  const [curSection, setCurSection] = useState("pending");
  const [secData, setSecData] = useState(null);

  function handleCurSection(value) {
    setCurSection(value);
  }
  
  useEffect(() => {
    axios
      .get(`http://127.0.0.1:8000/api/approve/${curSection}`)
      .then((response) => {
        setSecData(response.data);
      })
      .catch((error) => {
        console.log("Error while fetching Approval records");
      });
  }, [curSection]);

  return (
    <div>
      <div className="approve-sess-outer">
        <div onClick={() => handleCurSection(0)} className="approve-div">
          Accepted
        </div>
        <div onClick={() => handleCurSection(1)} className="approve-div">
          Pending
        </div>
        <div onClick={() => handleCurSection(2)} className="approve-div">
          Cancelled
        </div>
      </div>
      <div className="approve-canvas">
        <ApproveDiv />
        <ApproveDiv />
        <ApproveDiv />
        <ApproveDiv />
        <ApproveDiv />
      </div>
    </div>
  );
}
