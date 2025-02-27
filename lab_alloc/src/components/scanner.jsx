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
          scanner.clear(); // Stop scanning once a QR code is detected
        });
      };

      startScanner(); // Start the scanner

      return () => scanner?.clear(); // Cleanup when the component unmounts
    }
  }, [showCheckIn]);

  useEffect(() => {
    if (scanData) {
      console.log("Scanned Data: ", scanData);
      axios
        .post(`http://127.0.0.1:8000/api/checkin/${scanData}`)
        .then((response) => {
          setCheckInStatus({
            success: true,
            message: response.data.message || "Check-in successful!",
          });
          setShowCheckIn(true);
        })
        .catch((error) => {
          setCheckInStatus({
            success: false,
            message: error.response?.data?.Message || "Check-in failed!",
          });
          setShowCheckIn(true);
        });

      // Hide the check-in status and restart scanning after 3 seconds
      setTimeout(() => {
        setShowCheckIn(false);
        setScanData(null); // Reset scanData to restart scanner
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
