import { DiAtom } from "react-icons/di";
import { MdDone } from "react-icons/md";
import { MdCheckBoxOutlineBlank } from "react-icons/md";

export default function ApproveDiv() {
  return (
    <div className="approve-outer-div">
      <div className="approve-content-div">
        <div className="approve-logo">
          <DiAtom style={{ fontSize: "1rem" }} />
        </div>
        <div style={{ fontSize: "0.8rem" }}>9:00 A.M - 12:00 P.M</div>
        <div style={{ display: "flex", fontSize: "0.85rem", gap: "0.75rem" }}>
          <div>12 Jul</div>
          <div>Richard</div>
          <div>Quantum Lab</div>
          <div style={{ color: "green" }}>Approved</div>
        </div>
      </div>
    </div>
  );
}
