import React, { useRef, useEffect } from "react";
import Webcam from "react-webcam";

const Broadcaster = ({socket}) => {
  const webcamRef = useRef(null);

  const sendFrame = async () => {
    if (
      webcamRef.current &&
      webcamRef.current.getScreenshot &&
      socket &&
      socket.readyState === WebSocket.OPEN
    ) {
      const screenshot = webcamRef.current.getScreenshot();
      if (screenshot) {
        const base64Frame = screenshot.split(",")[1]; // Remove the data:image/jpeg;base64, part
        socket.send(JSON.stringify({ video: base64Frame }));
        console.log(webcamRef.current.getScreenshot());
      }
    }
  };

  useEffect(() => {
    const interval = setInterval(() => {
      sendFrame();
    }, 1000 / 60); // 60 fps

    return () => clearInterval(interval);
  }, [socket]);

  return (
    <div>
      <Webcam
        audio={false}
        ref={webcamRef}
        screenshotFormat="image/jpeg"
        className="hidden"
      />
    </div>
  );
};

export default Broadcaster;
