import { DomainVerification } from "@mui/icons-material";
import { DiAtom } from "react-icons/di";
export default function Card() {
  return( 
      <div className="event-card-outer">
          <div className="event-card">
          <div><DiAtom style={{fontSize:'1.5rem'}}/></div>
          <div className="event-card-body">
            <div style={{fontWeight:'500'}}>Kevin</div>
            <div style={{fontSize:'0.7rem'}}>9:00 - 10:00</div>
          </div>
        </div>
      </div>
);
}