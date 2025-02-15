import { GiBubblingFlask } from "react-icons/gi";
import { DiAtom } from "react-icons/di";
import { MdOutlineArrowCircleUp } from "react-icons/md";
import { CiCircleChevLeft } from "react-icons/ci";
import { useState, useEffect } from "react";
import { IoTodayOutline } from "react-icons/io5";
import { BsCalendar4Week } from "react-icons/bs";
import { BsCalendar2Month } from "react-icons/bs";
import axios from "axios";

export default function Stats(props) {
  const [interval, setInterval] = useState(1);
  const [statInfo, setStatInfo] = useState([]);
  const [processedData, setProcessedData] = useState([]);
  const [reset, setReset] = useState('2025-02-13')
  const [dayState, setDayState] = useState(5);
  const [weekState, setWeekState] = useState(5);
  const [monthState, setMonthState] = useState(5);

  function handleInterval(value) {
    setInterval((prevState) => value);
  }

  useEffect(() => {
    axios
      .get("http://127.0.0.1:8000/api/daily")
      .then((response) => {
        setStatInfo(response.data);
      })
      .catch((error) => console.log("Error fetching Daily", error));
  }, []);

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

  return (
    <div className="stats-outer">
      <div className="interval-outer">
        <button className="interval" onClick={() => handleInterval(0)}>
          <div className="interval-icon">
            <IoTodayOutline />
          </div>
          <div>Day</div>
        </button>
        <button className="interval" onClick={() => handleInterval(1)}>
          <div className="interval-icon">
            <BsCalendar4Week />
          </div>
          <div>Week</div>
        </button>
        <button className="interval" onClick={() => handleInterval(2)}>
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
                Day {index_i + 1}
              </div>
              <div className="weekDate">7/05 - 7/09</div>
            </div>
            {lab_list.map((value, index_j) => (
              <div
                className="week-div"
                sstyle={{
                  background:
                    value > 0
                      ? `linear-gradient(to top, #edf5ea 50%, transparent 50%)`
                      : "transparent",
                }}
              >
                <div className="lab-info">
                  <div className="week-info">
                    <div style={{ fontWeight: "500" }}>{value} h</div>
                    <div style={{ fontSize: "0.7rem", color: "#818493" }}>
                      {Math.round((value / 15) * 100)}%
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
