import React, { useState, useEffect } from 'react';
import Broadcaster from './Broadcaster';
import { useNavigate } from 'react-router-dom';

function Monitor() {
	const [socket, setSocket] = useState(null);
	const navigate = useNavigate();

	useEffect(() => {
		const socketInstance = new WebSocket('ws://34.101.110.106/ws/video_stream/');

		socketInstance.onopen = () => {
			console.log('WebSocket connection established');
			setSocket(socketInstance);
		};

		socketInstance.onerror = (error) => {
			console.error('WebSocket error:', error);
		};

		socketInstance.onclose = (event) => {
			if (event.wasClean) {
				console.log(
					`WebSocket connection closed cleanly, code=${event.code}, reason=${event.reason}`
				);
			} else {
				console.error('WebSocket connection closed unexpectedly');
			}
			setSocket(null);
		};

		return () => {
			if (socketInstance.readyState === WebSocket.OPEN) {
				socketInstance.close();
			}
		};
	}, []);

	const handleDisconnect = () => {
		if (socket) {
			socket.close();
		}
		setSocket(null);
		navigate('/');
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
				<h1 className="font-semibold text-2xl md:text-4xl">Connected as Monitor</h1>

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
