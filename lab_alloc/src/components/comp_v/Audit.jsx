import "../../index.css";
import { useState, useEffect } from "react";
import axios from "axios";
import { motion } from "framer-motion";
import Navbar from "../navbar.jsx";
import Pagination from "@mui/material/Pagination";
import {
  Search,
  Filter,
  CircleCheck,
  CircleX,
  CircleSlash,
} from "lucide-react";
export default function Audit() {
  const [allScheduleReq, setAllScheduleReq] = useState([]);
  const [filteredRec, setFilteredRec] = useState([]);
  const [pageState, setPageState] = useState(1);
  const [filterState, setFilterState] = useState(false);
  const [chosenFilter, setChooseFilter] = useState("reset");
  const [showDetails, setShowDetails] = useState(null);
  const [totalPages, setTotalPages] = useState(1);
  const admin = "admin1";
  function formatDate(date_elem) {
    const dateObj = new Date(date_elem);
    var dateString =
      dateObj.toLocaleDateString("en-US", { month: "short" }) +
      " " +
      dateObj.getDate() +
      ", " +
      dateObj.getFullYear();
    return dateString;
  }
  function displayDetails(id) {
    if (showDetails === null) {
      setShowDetails(id);
    } else if (showDetails == id) {
      setShowDetails(null);
    } else if (showDetails != null) {
      setShowDetails(id);
    }
  }
  function handlePageChange(event, value) {
    setPageState(value);
  }
  function handleSearch(even, value) {
    console.log(value);
  }
  useEffect(() => {
    axios
      .get(`http://127.0.0.1:8000/api/schedule_req/${pageState}`)
      .then((response) => {
        setAllScheduleReq(response.data.data);
        setTotalPages(response.data.total);
        console.log("Response data : ", response.data);
      })
      .catch((error) =>
        console.log(
          "Error while fetching all the admin's approved or rejected schedules"
        )
      );
  }, []);

  return (
    <div
      style={{
        dispay: "flex",
        marginTop: "5rem",
        height: "100vh",
      }}
    >
      <div style={{ margin: "1rem", fontFamily: "Roboto" }}>
        <div
          style={{
            display: "flex",
            flexDirection: "column",
            gap: "0.5rem",
            padding: "0.5rem",
          }}
        >
          <div
            style={{
              fontSize: "1.5rem",
              fontWeight: "900",
            }}
          >
            Audit Log
          </div>
          <div
            style={{
              fontSize: "0.9rem",
              fontWeight: "400",
              color: " #6c757d",
            }}
          >
            Track all approval and rejection decisions for complete
            accountability
          </div>
        </div>
        <div
          style={{
            border: "1px solid rgb(183, 183, 183)",
            borderRadius: "0.5rem",
            height: "60vh",
            overflowY:"auto",
            marginBottom: "1.5rem",
          }}
        >
          <div
            style={{
              display: "flex",
              gap: "0.5rem",
              padding: "0.75rem 1rem",
            }}
          >
            <div
              style={{
                display: "flex",
                gap: "0.5rem",
                alignItems: "center",
                backgroundColor: "rgb(245,245,247)",
                borderRadius: "0.5rem",
                flex: "1",
                padding: "0rem 0.8rem",
              }}
            >
              <Search size={16} color={"gray"} onChange={handleSearch} />
              <div style={{ width: "100%" }}>
                <input
                  type="text"
                  id="search-audit"
                  placeholder="Search by request, auditor, or requester..."
                />
              </div>
            </div>
            <div>
              <button
                className="audit-filter"
                onClick={() => setFilterState((prevState) => !prevState)}
              >
                <Filter size={16} />
                <div dis>Filter</div>
              </button>
            </div>
          </div>
          {filterState && (
            <div className="filter-box">
              <div style={{ fontWeight: "500" }}>Filter Records</div>
              <div style={{ marginTop: "0.5rem" }}>
                <div style={{ color: "gray", fontSize: "0.8rem" }}>Status</div>
                <div
                  style={{
                    display: "flex",
                    gap: "0.5rem",
                    margin: "0.5rem 0rem",
                  }}
                  className="fil-btns"
                >
                  <div
                    style={{
                      display: "flex",
                      flexDirection: "column",
                      gap: "0.5rem",
                    }}
                  >
                    <div>
                      <button
                        onClick={() => setChooseFilter("approved")}
                        className={`${
                          chosenFilter === "approved"
                        } ? ${chosenFilter}-filter : ""`}
                      >
                        Approved
                      </button>
                    </div>
                    <div>
                      <button
                        onClick={() => setChooseFilter("rejected")}
                        className={`${
                          chosenFilter === "rejected"
                        } ? ${chosenFilter}-filter : ""`}
                      >
                        Rejected
                      </button>
                    </div>
                  </div>
                  <div
                    style={{
                      display: "flex",
                      flexDirection: "column",
                      gap: "0.5rem",
                    }}
                  >
                    <div>
                      <button
                        onClick={() => setChooseFilter("blocked")}
                        className={`${
                          chosenFilter === "blocked"
                        } ? ${chosenFilter}-filter : ""`}
                      >
                        Blocked
                      </button>
                    </div>
                    <div>
                      <button
                        onClick={() => setChooseFilter("reset")}
                        style={{ backgroundColor: "black", color: "white" }}
                      >
                        Reset
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}
          {allScheduleReq.map((elem, _) => {
            if (chosenFilter === "reset" || elem.status === chosenFilter) {
              return (
                <div
                  style={{
                    backgroundColor:
                      showDetails !== null && showDetails === elem.id
                        ? "rgb(237, 237, 237)"
                        : "",
                  }}
                >
                  <div
                    style={{
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "space-between",
                      padding: "0.5rem 0.75rem",
                      height: "2rem",
                      borderTop: "1px solid rgb(211, 211, 211)",
                    }}
                    className="audit-records"
                    onClick={() => displayDetails(elem.id)}
                  >
                    <div
                      style={{
                        display: "flex",
                        gap: "0.5rem",
                        alignItems: "center",
                        fontSize: "0.87rem",
                        fontWeight: "500",
                      }}
                    >
                      {elem.status === "approved" ? (
                        <CircleCheck
                          size={16}
                          style={{ color: "lightgreen" }}
                        />
                      ) : elem.status === "rejected" ? (
                        <CircleX size={16} style={{ color: "red" }} />
                      ) : (
                        <CircleSlash size={16} style={{ color: "gray" }} />
                      )}
                      <div>
                        {elem.username} #{elem.id}
                      </div>
                    </div>
                    <div
                      style={{
                        display: "flex",
                        gap: "1rem",
                        fontSize: "0.8rem",
                        alignItems: "center",
                        margin: "0rem 0.5rem",
                      }}
                    >
                      <div className={`${elem.status}`}>{elem.status}</div>
                      <div
                        style={{ color: "rgb(139, 139, 139)", width: "5rem" }}
                      >
                        {formatDate(elem.schedule_date)}
                      </div>
                    </div>
                  </div>
                  {(showDetails != null) & (showDetails === elem.id) ? (
                    <motion.div
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: 0.2, duration: 0.25 }}
                      style={{
                        display: "flex",
                        justifyContent: "space-between",
                        width: "50%",
                        height: "3rem",
                        alignItems: "center",
                        margin: "0rem 1rem",
                      }}
                    >
                      <div>
                        <div
                          style={{
                            fontSize: "0.8rem",
                            color: "rgb(127, 127, 127)",
                          }}
                        >
                          Auditor
                        </div>
                        <div style={{ fontSize: "0.85rem", fontWeight: "350" }}>
                          {elem.approved_by}
                        </div>
                      </div>
                      <div>
                        <div
                          style={{
                            fontSize: "0.8rem",
                            color: "rgb(127, 127, 127)",
                          }}
                        >
                          Department
                        </div>
                        <div style={{ fontSize: "0.85rem", fontWeight: "350" }}>
                          Research and Development
                        </div>
                      </div>
                    </motion.div>
                  ) : (
                    <div></div>
                  )}
                </div>
              );
            }
          })}
        </div>
        <Pagination
          count={totalPages / 10 + 1}
          color="primary"
          style={{
            position: "relative",
            justifyItems: "center",
            border: "none",
          }}
          onChange={handlePageChange}
        />
      </div>
    </div>
  );
}
