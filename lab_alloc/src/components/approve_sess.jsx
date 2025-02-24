import ApproveDiv from "./approve_div";
import { useState, useEffect } from "react";
import axios from "axios";
export default function Approve() {
  const [curSection, setCurSection] = useState(0);
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
        <div onClick={() => handleCurSection(0)}>Accepted</div>
        <div onClick={() => handleCurSection(1)}>Pending</div>
        <div onClick={() => handleCurSection(2)}>Cancelled</div>
      </div>
      <div className="approve-canvas">

      </div>
    </div>
  );
}
