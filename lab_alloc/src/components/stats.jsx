import { GiBubblingFlask } from "react-icons/gi";
import { DiAtom } from "react-icons/di";
export default function Stats() {
  return (
    <div className="stats-outer">
      <div className="stats-table">
        <div className="col-1">
          <div className="lab-div">
            <div
              style={{
                fontFamily: "Roboto",
                fontWeight: "500",
                fontSize: "1rem",
                padding: "0.5rem",
              }}
            >
              Utilization report
            </div>
          </div>
          <div className="lab-div">
            <div className="lab-logo">
              <DiAtom />
            </div>
            <div className="lab-info">
              <div className="lab-info-up">
                <div style={{ fontWeight: "500", fontSize: "0.9rem" }}>
                  Quantum
                </div>
                <div style={{ fontSize: "0.8rem", color: "red" }}>
                  12h 19min
                </div>
              </div>
              <div className="lab-info-down"></div>
            </div>
          </div>
          <div className="lab-div">
            <div className="lab-logo">
              <GiBubblingFlask />
            </div>
            <div className="lab-info">
              <div className="lab-info-up">
                <div style={{ fontWeight: "500", fontSize: "0.9rem" }}>
                  Chemistry
                </div>
                <div style={{ fontSize: "0.8rem", color: "red" }}>
                  10h 30min
                </div>
              </div>
              <div className="lab-info-down"></div>
            </div>
          </div>
        </div>
        <div className="col-1">
          <div className="week-div-title">
            <div
              style={{
                fontFamily: "Roboto",
                fontWeight: "500",
                fontSize: "0.8rem",
                marginBottom: "0.3rem",
              }}
            >
              Week 27
            </div>
            <div className="weekDate">7/05 - 7/09</div>
          </div>
          <div className="week-div">
            <div className="lab-info">
              <div className="week-info">
                <div style={{ fontWeight: "500" }}>2:15 h</div>
                <div style={{ fontSize: "0.7rem", color: "#818493" }}>5%</div>
              </div>
              <div className="lab-info-down"></div>
            </div>
          </div>
          <div className="week-div">
            <div className="lab-info">
              <div className="week-info">
                <div style={{ fontWeight: "500" }}>8:45 h</div>
                <div style={{ fontSize: "0.7rem", color: "#818493" }}>15%</div>
              </div>
              <div className="lab-info-down"></div>
            </div>
          </div>
        </div>
        <div className="col-1">
          <div className="week-div-title">
            <div
              style={{
                fontFamily: "Roboto",
                fontWeight: "500",
                fontSize: "0.8rem",
                marginBottom: "0.3rem",
              }}
            >
              Week 28
            </div>
            <div className="weekDate">7/10 - 16/7</div>
          </div>
          <div className="week-div">
            <div className="lab-info">
              <div className="week-info">
                <div style={{ fontWeight: "500" }}>2:15 h</div>
                <div style={{ fontSize: "0.7rem", color: "#818493" }}>5%</div>
              </div>
              <div className="lab-info-down"></div>
            </div>
          </div>
          <div className="week-div">
            <div className="lab-info">
              <div className="week-info">
                <div style={{ fontWeight: "500" }}>8:45 h</div>
                <div style={{ fontSize: "0.7rem", color: "#818493" }}>15%</div>
              </div>
              <div className="lab-info-down"></div>
            </div>
          </div>
        </div>
        <div className="col-1">
          <div className="week-div-title">
            <div
              style={{
                fontFamily: "Roboto",
                fontWeight: "500",
                fontSize: "0.8rem",
                marginBottom: "0.3rem",
              }}
            >
              Week 29
            </div>
            <div className="weekDate">7/17 - 7/23</div>
          </div>
          <div className="week-div">
            <div className="lab-info">
              <div className="week-info">
                <div style={{ fontWeight: "500" }}>2:15 h</div>
                <div style={{ fontSize: "0.7rem", color: "#818493" }}>5%</div>
              </div>
              <div className="lab-info-down"></div>
            </div>
          </div>
          <div className="week-div">
            <div className="lab-info">
              <div className="week-info">
                <div style={{ fontWeight: "500" }}>8:45 h</div>
                <div style={{ fontSize: "0.7rem", color: "#818493" }}>15%</div>
              </div>
              <div className="lab-info-down"></div>
            </div>
          </div>
        </div>
        <div className="col-1">
          <div className="week-div-title">
            <div
              style={{
                fontFamily: "Roboto",
                fontWeight: "500",
                fontSize: "0.8rem",
                marginBottom: "0.3rem",
              }}
            >
              Week 30
            </div>
            <div className="weekDate">7/24 - 7/30</div>
          </div>
          <div className="week-div">
            <div className="lab-info">
              <div className="week-info">
                <div style={{ fontWeight: "500" }}>2:15 h</div>
                <div style={{ fontSize: "0.7rem", color: "#818493" }}>5%</div>
              </div>
              <div className="lab-info-down"></div>
            </div>
          </div>
          <div className="week-div">
            <div className="lab-info">
              <div className="week-info">
                <div style={{ fontWeight: "500" }}>8:45 h</div>
                <div style={{ fontSize: "0.7rem", color: "#818493" }}>15%</div>
              </div>
              <div className="lab-info-down"></div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
