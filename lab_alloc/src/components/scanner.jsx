import React, { useEffect, useState } from "react";
import { Html5QrcodeScanner } from "html5-qrcode";
import axios from "axios";
import CheckIn from "./check_in_div";

const QRCodeScanner = () => {
  const [scanData, setScanData] = useState(null);
  const [checkInStatus, setCheckInStatus] = useState(null);
  const [showCheckIn, setShowCheckIn] = useState(false);

  useEffect(() => {
    if (!showCheckIn) {
      let scanner;
      const startScanner = () => {
        scanner = new Html5QrcodeScanner("qr-video", { fps: 10, qrbox: 250 });
        scanner.render((qrCodeMessage) => {
          setScanData(qrCodeMessage);
          scanner.clear();
        });
      };

      startScanner();

      return () => scanner?.clear();
    }
  }, [showCheckIn]);

  useEffect(() => {
    if (scanData) {
      console.log("Scanned Data: ", scanData);
      axios
        .patch(`http://127.0.0.1:8000/api/checkin/${scanData}`)
        .then((response) => {
          if (response.data.Message === "In Progress") {
            setCheckInStatus({
              success: true,
              message: "Check-in successful!",
            });
            setShowCheckIn(true);
          } else if (response.data.Message === "Completed") {
            setCheckInStatus({
              success: true,
              message: "Check-out successful!",
            });
            setShowCheckIn(true);
          } else if (response.data.Message === "Blocked") {
            setCheckInStatus({
              success: true,
              message: "Session Blocked",
            });
            setShowCheckIn(true);
          } else if (response.data.Message === "Already Completed") {
            setCheckInStatus({
              success: true,
              message: "Session Already Finished",
            });
            setShowCheckIn(true);
          }
        })
        .catch((error) => {
          setCheckInStatus({
            success: false,
            message: error.response?.data?.Message || "Check-in failed!",
          });
          setShowCheckIn(true);
        });

      setTimeout(() => {
        setShowCheckIn(false);
        setScanData(null);
      }, 3000);
    }
  }, [scanData]);

  return (
    <div className={showCheckIn ? "show-checkin-dia" : ""}>
      {showCheckIn ? (
        <CheckIn
          success={checkInStatus.success}
          message={checkInStatus.message}
        />
      ) : (
        <div id="qr-video"></div>
      )}
    </div>
  );
};

export default QRCodeScanner;
