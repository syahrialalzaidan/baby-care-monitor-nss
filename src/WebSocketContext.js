import React, { createContext, useState, useEffect } from 'react';

export const WebSocketContext = createContext(null);

export const WebSocketProvider = ({ children }) => {
	const [socket, setSocket] = useState(null);

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

	return <WebSocketContext.Provider value={socket}>{children}</WebSocketContext.Provider>;
};
