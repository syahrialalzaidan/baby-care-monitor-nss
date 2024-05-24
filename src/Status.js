import React, { useContext } from 'react';
import { useNavigate } from 'react-router-dom';
import VideoClient from './VideoClient';
import { WebSocketContext } from './WebSocketContext';

export default function Status() {
	const socket = useContext(WebSocketContext);
	const navigate = useNavigate();

	const handleDisconnect = () => {
		if (socket) {
			socket.close();
		}
		navigate('/');
	};

	const handleMusic = () => {
		navigate('/music');
	};

	return (
		<div className="bg-[#FCFFE0] min-h-screen">
			<div className="bg-[#BACD92] h-20 md:h-24 flex justify-center items-center w-full text-3xl md:text-5xl z-50 font-semibold">
				Name's Room
			</div>

			<div className="py-4 px-8">
				<div className="w-full flex justify-center">
					<div className="w-full flex justify-center">
						{socket && <VideoClient socket={socket} />}
					</div>
				</div>

				<div className="flex flex-col gap-4 items-center mt-4">
					<div className="bg-[#E4FFE0] flex items-center justify-center w-36 p-4 rounded-lg">
						<p>
							Status: <span className="text-[#519246] font-semibold">Normal</span>
						</p>
					</div>

					<button
						className="bg-[#E4FFE0] flex items-center justify-center p-4 w-36 rounded-lg"
						onClick={handleMusic}
					>
						<p className="font-semibold">Music</p>
					</button>

					<button
						className="bg-red-500 text-white p-4 rounded-lg w-36"
						onClick={handleDisconnect}
					>
						Disconnect
					</button>
				</div>
			</div>
		</div>
	);
}
