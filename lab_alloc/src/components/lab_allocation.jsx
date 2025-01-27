export default function LabAlloc() {
  return (
    <div className="cur-lab-util">
      <div
        style={{
          fontFamily: "Roboto",
          textTransform: "uppercase",
          fontSize: "0.75rem",
        }}
      >
        Current Lab Utilization
      </div>
      <div className="cur-lab-outer">
        <div className="cur-lab-logo">
          <DiAtom />
        </div>
        <div
          style={{
            display: "flex",
            flexDirection: "column",
            gap: "0.25rem",
            justifyContent: "center",
          }}
        >
          <div className="cur-lab-up">
            <div className="cur-lab-name">Quantum</div>
            <div className="cur-lab-count-info">
              <div className="cur-lab-count">19 / 20 blocks</div>
              <div className="cur-lab-hike">
                28%
                <MdOutlineArrowCircleUp />
              </div>
            </div>
          </div>
          <div className="cur-lab-down">
            <div className="blocks-div">
              {[...Array(20)].map((_, index) => (
                <div
                  key={index}
                  className={`block ${index < 10 ? "highlight" : ""}`}
                ></div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
