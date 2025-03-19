import { DiAtom } from "react-icons/di";
import { useState, useEffect } from "react";
import { IoTodayOutline } from "react-icons/io5";
import { BsCalendar4Week } from "react-icons/bs";
import { BsCalendar2Month } from "react-icons/bs";
import axios from "axios";

export default function Stats(props) {
  const [interval, setInterval] = useState("Day");
  const [statInfo, setStatInfo] = useState([]);
  const [processedData, setProcessedData] = useState([]);
  const [weekStatInfo, setWeekStatInfo] = useState([]);
  const [reset, setReset] = useState("2025-02-13");
  const [dayState, setDayState] = useState(1);
  const [weekState, setWeekState] = useState(1);
  const [monthState, setMonthState] = useState(1);

  function handleInterval(value) {
    setInterval((prevState) => value);
  }

  useEffect(() => {
    if (interval === "Day") {
      axios
        .get("http://127.0.0.1:8000/api/daily")
        .then((response) => {
          setStatInfo(response.data);
        })
        .catch((error) => console.log("Error fetching Daily", error));
    }
  }, [interval]);

  useEffect(() => {
    const array = Array.from({ length: 5 }, (_, i) =>
      Array.from({ length: 10 }, (_, j) => 0)
    );
    const firstElement = statInfo[0];
    statInfo.forEach((element) => {
      let dayDiff =
        (new Date(element.date) - new Date(firstElement.date)) /
        (1000 * 60 * 60 * 24);
      array[dayDiff][element.lab_id - 1] = element.hours;
    });
    if (statInfo.length > 0) {
      setProcessedData((prevState) => array);
    }
  }, [statInfo]);

  useEffect(() => {
    if (interval === "Week") {
      axios
        .get(`http://127.0.0.1:8000/api/week/${weekState}/`)
        .then((response) => {
          if (response.data && Object.keys(response.data).length > 0) {
            setWeekStatInfo(response.data);
            console.log("Response Data:", response.data);
          } else {
            console.log("No data found in the response.");
          }
        })
        .catch((error) => {
          console.error("Error while fetching Week:", error);
        });
    }
  }, [interval]);

  useEffect(() => {
    const array = Array.from({ length: 5 }, (_, i) =>
      Array.from({ length: props.labs.length - 1 }, (_, j) => 0)
    );

    weekStatInfo.map((elem, index) => {
      array[elem.week_num - 1][elem.lab_id - 1] = elem.total_hours;
    });

    console.log("Processed Week Array", array);
    setProcessedData((prevState) => array);
  }, [weekStatInfo]);

  return (
    <div className="stats-outer">
      <div className="interval-outer">
        <button className="interval" onClick={() => handleInterval("Day")}>
          <div className="interval-icon">
            <IoTodayOutline />
          </div>
          <div>Day</div>
        </button>
        <button className="interval" onClick={() => handleInterval("Week")}>
          <div className="interval-icon">
            <BsCalendar4Week />
          </div>
          <div>Week</div>
        </button>
        <button className="interval" onClick={() => handleInterval("Month")}>
          <div className="interval-icon">
            <BsCalendar2Month />
          </div>
          <div>Month</div>
        </button>
      </div>
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
          {props.labs.slice(1).map((element) => (
            <div className="lab-div">
              <div className="lab-logo">
                <DiAtom />
              </div>
              <div className="lab-info">
                <div className="lab-info-up">
                  <div style={{ fontWeight: "500", fontSize: "0.9rem" }}>
                    {element.lab_name}
                  </div>
                </div>
                <div className="lab-info-down"></div>
              </div>
            </div>
          ))}
        </div>
        {processedData.map((lab_list, index_i) => (
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
                {interval} {index_i + 1}
              </div>
              {/* <div className="weekDate">7/05 - 7/09</div> */}
            </div>
            {lab_list.map((value, index_j) => (
              <div
                className="week-div"
                style={{
                  background:
                    value > 0
                      ? `linear-gradient(to top, #edf5ea ${value}%, transparent 50%)`
                      : "transparent",
                }}
              >
                <div className="lab-info">
                  <div className="week-info">
                    <div style={{ fontWeight: "500" }}>{value} h</div>
                    <div style={{ fontSize: "0.7rem", color: "#818493" }}>
                      {Math.round(
                        (value /
                          (interval === "Day"
                            ? 15
                            : interval === "Week"
                            ? 15 * 7
                            : 15 * 30)) *
                          100
                      )}
                      %
                    </div>
                  </div>
                  <div className="lab-info-down"></div>
                </div>
              </div>
            ))}
          </div>
        ))}
      </div>
    </div>
  );
}
