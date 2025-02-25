import { TbCircleNumber1 } from "react-icons/tb";
import { useState } from "react";
import { TbCircleNumber2 } from "react-icons/tb";
import { IoCloudUploadOutline } from "react-icons/io5";
import axios from "axios";

export default function NewSession() {
  const [formData, setFormData] = useState({
    lab_name: "",
    schedule_date: null,
    schedule_from: null,
    schedule_to: null,
  });
  const [step, setStep] = useState(1);
  function handleContinue(event) {
    event.preventDefault();
    setStep((prevState) => prevState + 1);
  }
  function handlePrevious(event) {
    event.preventDefault();
    setStep((prevState) => prevState - 1);
  }

  function handleOnChange(event) {
    const { name, value } = event.target;
    setFormData((prevState) => ({
      ...prevState,
      [name]: value,
    }));
  }

  async function handleSubmit(event) {
    event.preventDefault();

    if (
      !formData.lab_name ||
      !formData.schedule_date ||
      !formData.schedule_from ||
      !formData.schedule_to
    ) {
      alert("Please fill all the fields");
    }

    const username = "George";
    const data = new FormData();
    data.append("username", username);
    data.append("lab_name", formData.lab_name);
    data.append("schedule_date", formData.schedule_date);
    data.append("schedule_from", formData.schedule_from);
    data.append("schedule_to", formData.schedule_to);

    const response = await axios.post(
      "http://127.0.0.1:8000/api/schedule/create",
      data
    );

    console.log(response.data);
  }
  return (
    <form className="session-forms">
      {step == 1 && (
        <div className="session-first-div">
          <div
            style={{
              fontSize: "1.25rem",
              fontWeight: "500",
              fontFamily: "Playfair Display",
              textAlign: "left",
            }}
          >
            Join the session
          </div>
          <div
            style={{
              margin: "1rem 0rem",
              display: "flex",
              gap: "1rem",
              alignItems: "center",
            }}
          >
            <TbCircleNumber1 style={{ fontSize: "1.5rem" }} />
            <div style={{ fontFamily: "Roboto" }}>Step</div>
          </div>
          <div className="session-left-body">
            <div>
              <div className="session-input-div">
                <label htmlFor="lab_name" className="input-label">
                  Lab Name
                </label>
                <input
                  type="text"
                  placeholder="Enter the Laboratory Name"
                  name="lab_name"
                  value={formData.lab_name}
                  onChange={handleOnChange}
                />
              </div>
              <div className="session-input-div">
                <label htmlFor="schedule_date" className="input-label">
                  Date
                </label>
                <input
                  type="date"
                  name="schedule_date"
                  value={formData.schedule_date}
                  onChange={handleOnChange}
                />
              </div>
            </div>
            <div>
              <div className="session-input-div">
                <label htmlFor="schedule_from" className="input-label">
                  From
                </label>
                <input
                  type="time"
                  name="schedule_from"
                  onChange={handleOnChange}
                  value={formData.schedule_from}
                />
              </div>
              <div className="session-input-div">
                <label htmlFor="schedule_to" className="input-label">
                  To
                </label>
                <input
                  type="time"
                  name="schedule_to"
                  onChange={handleOnChange}
                  value={formData.schedule_to}
                />
              </div>
            </div>
          </div>
          <div>
            <button
              className="session-input-button session-submit-button"
              type="button"
              onClick={handleSubmit}
            >
              Submit
            </button>
          </div>
        </div>
      )}
      {/* {step == 2 && (
        <div className="session-second-div">
          <div className="session-first-div">
            <div
              style={{
                fontSize: "1.25rem",
                fontWeight: "500",
                fontFamily: "Playfair Display",
                textAlign: "left",
              }}
            >
              Join the session
            </div>
            <div
              style={{
                margin: "1rem 0rem",
                display: "flex",
                gap: "1rem",
                alignItems: "center",
              }}
            >
              <TbCircleNumber2 style={{ fontSize: "1.5rem" }} />
              <div style={{ fontFamily: "Roboto" }}>Step</div>
            </div>
            <br />
            <div>
              <div
                style={{
                  fontSize: "1.5rem",
                  fontFamily: "Oswald",
                  letterSpacing: "2px",
                }}
              >
                Upload your Attachements
              </div>
              <div>
                <div>
                  <label htmlFor="fileUpload" className="file-upload">
                    <IoCloudUploadOutline style={{ fontSize: "2rem" }} />
                    <div style={{ fontFamily: "Oswald", letterSpacing: "2px" }}>
                      .PDF & .DOC
                    </div>
                  </label>
                </div>
                <input type="file" id="fileUpload" name="files" multiple />
              </div>
            </div>
            <div style={{ display: "flex", gap: "1rem" }}>
              <button
                className="session-input-button"
                type="button"
                onClick={handlePrevious}
              >
                Previous
              </button>
              <button
                className="session-input-button session-submit-button"
                type="button"
                onClick={handleSubmit}
              >
                Submit
              </button>
            </div>
          </div>
        </div>
      )} */}
    </form>
  );
}
