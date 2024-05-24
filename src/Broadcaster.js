import React, { useRef, useEffect } from "react";
import Webcam from "react-webcam";

const Broadcaster = ({ socket }) => {
  const webcamRef = useRef(null);

  const sendFrame = async () => {
    if (
      webcamRef.current &&
      webcamRef.current.getScreenshot &&
      socket &&
      socket.readyState === WebSocket.OPEN
    ) {
      try {
        const screenshot = webcamRef.current.getScreenshot();
        if (screenshot && screenshot.startsWith("data:image")) {
          const base64Frame = screenshot.split(",")[1]; // Remove the data:image/jpeg;base64, part
          socket.send(JSON.stringify({ video: base64Frame }));
          console.log("Full data URI:", screenshot);
          console.log("Base64 data:", base64Frame);
        } else {
          console.error("Failed to capture screenshot: Invalid screenshot data");
        }
      } catch (error) {
        console.error("Error capturing screenshot:", error);
      }
    } else {
      console.error("Webcam or WebSocket not ready");
    }
  };

  useEffect(() => {
    const interval = setInterval(() => {
      sendFrame();
    }, 1000 / 60); // 60 fps

    return () => clearInterval(interval);
  }, [socket]);

  return (
    <div style={{ visibility: 'hidden', position: 'absolute' }}>
      <Webcam
        audio={false}
        ref={webcamRef}
        screenshotFormat="image/jpeg" // Try changing to "image/png" if needed
        width={640}
        height={480}
      />
    </div>
  );
};

export default Broadcaster;
