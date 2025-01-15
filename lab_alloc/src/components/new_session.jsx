import { TbCircleNumber1 } from "react-icons/tb";
import { useState } from "react";
import { TbCircleNumber2 } from "react-icons/tb";
import { IoCloudUploadOutline } from "react-icons/io5";

export default function NewSession() {
  const [step, setStep] = useState(1);
  function handleContinue(event) {
    event.preventDefault();
    setStep((prevState) => prevState + 1);
  }
  function handlePrevious(event) {
    event.preventDefault();
    setStep((prevState) => prevState - 1);
  }
  function handleSubmit(event){

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
                />
              </div>
              <div className="session-input-div">
                <label htmlFor="lab_name" className="input-label">
                  Date
                </label>
                <input type="date" />
              </div>
            </div>
            <div>
              <div className="session-input-div">
                <label htmlFor="lab_name" className="input-label">
                  From
                </label>
                <input type="time" />
              </div>
              <div className="session-input-div">
                <label htmlFor="lab_name" className="input-label">
                  To
                </label>
                <input type="time" />
              </div>
            </div>
          </div>
          {/* <div>
          <label class="file-upload">
            Attach a File
            <GrAttachment />
            <input type="file" name="file" />
          </label>
        </div> */}
          <div>
            <button
              className="session-input-button"
              type="button"
              onClick={handleContinue}
            >
              Continue
            </button>
          </div>
        </div>
      )}
      {step == 2 && (
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
      )}
    </form>
  );
}
