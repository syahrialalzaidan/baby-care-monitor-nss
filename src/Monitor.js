import React, { useState, useEffect,useContext } from "react";
import { WebSocketContext } from "./WebSocketContext";
import Broadcaster from "./Broadcaster";
import { useNavigate } from "react-router-dom";

function Monitor() {
  const socket = useContext(WebSocketContext);
  const navigate = useNavigate();


  const handleDisconnect = () => {
    if (socket) {
      socket.close();
    }
    navigate("/");
  };

  return (
    <div className="bg-[#FCFFE0] min-h-screen">
      <div className="bg-[#BACD92] h-20 md:h-24 flex justify-center items-center w-full text-3xl md:text-5xl z-50 fixed font-semibold">
        Baby Care Monitor
      </div>

      <img
        src="/baby-landing.svg"
        className="absolute left-0 top-0 max-h-screen object-cover z-0"
        alt="Baby Care Monitor"
      />

      <div className="bg-white w-4/5 md:w-fit flex flex-col justify-around items-center gap-8 text-black px-8 z-50 absolute py-6 rounded-lg md:left-96 bottom-48 left-6 md:top-72">
        <h1 className="font-semibold text-2xl md:text-4xl">
          Connected as Monitor
        </h1>

        <button
          className="bg-red-500 hover:brightness-105 text-white p-4 rounded-lg w-36"
          onClick={handleDisconnect}
        >
          Disconnect
        </button>
      </div>

      {socket ? <Broadcaster socket={socket} /> : null}
    </div>
  );
}

export default Monitor;
