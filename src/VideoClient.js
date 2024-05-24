import React, { useRef, useEffect } from 'react';

const VideoClient = ({ socket }) => {
	const canvasRef = useRef(null);

	useEffect(() => {
		if (!socket) return;

		const handleOpen = () => {
			console.log('Connected to the broadcaster');
		};

		const handleMessage = (event) => {
			const data = JSON.parse(event.data);
			if (data.video) {
				const img = new Image();
				img.src = `data:image/jpeg;base64,${data.video}`;
				console.log(data);
				img.onload = () => {
					if (canvasRef.current) {
						const ctx = canvasRef.current.getContext('2d');
						ctx.drawImage(img, 0, 0, canvasRef.current.width, canvasRef.current.height);
					}
				};
			}
		};

		const handleError = (error) => {
			console.error('WebSocket error:', error);
		};

		const handleClose = () => {
			console.log('Disconnected from the broadcaster');
		};

		socket.addEventListener('open', handleOpen);
		socket.addEventListener('message', handleMessage);
		socket.addEventListener('error', handleError);
		socket.addEventListener('close', handleClose);

		return () => {
			socket.removeEventListener('open', handleOpen);
			socket.removeEventListener('message', handleMessage);
			socket.removeEventListener('error', handleError);
			socket.removeEventListener('close', handleClose);
		};
	}, [socket]);

	return (
		<div>
			<canvas ref={canvasRef} width={640} height={480} />
		</div>
	);
};

export default VideoClient;
