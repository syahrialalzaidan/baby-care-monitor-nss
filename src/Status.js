import React, { useContext, useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import VideoClient from './VideoClient';
import { WebSocketContext } from './WebSocketContext';

export default function Status() {
	const [isBabyCrying, setIsBabyCrying] = useState(false);
	const socket = useContext(WebSocketContext);
	const navigate = useNavigate();

	const handleDisconnect = () => {
		navigate('/');
	};

	const handleMusic = () => {
		navigate('/music');
	};

	useEffect(() => {
		const interval = setInterval(async () => {
			const response = await fetch('http://34.101.110.106/api/baby_status/');
			const data = await response.json();
			console.log(data);
			setIsBabyCrying(data['is_baby_crying']);

			console.log(isBabyCrying);
			if (isBabyCrying) {
				alert('Baby is crying!');
			}
		}, 5000);
		return () => {
			clearInterval(interval);
		};
	}, [setIsBabyCrying]);

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
							Status:{' '}
							{isBabyCrying ? (
								<span className="text-[#FF0000] font-semibold">Crying!</span>
							) : (
								<span className="text-[#519246] font-semibold">Normal</span>
							)}
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
