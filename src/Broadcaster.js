import React, { useEffect, useRef, useState } from 'react';
import { useAudioRecorder } from 'react-audio-voice-recorder';
import Webcam from 'react-webcam';
import { WaveFile } from 'wavefile';

const decodeOggBlob = async (blob) => {
	const arrayBuffer = await blob.arrayBuffer();
	const audioContext = new (window.AudioContext || window.webkitAudioContext)();
	return await audioContext.decodeAudioData(arrayBuffer);
};

const convertOggToWav = async (blob) => {
	const decodedAudioData = await decodeOggBlob(blob);

	// Prepare WAV encoding parameters
	const wav = new WaveFile();
	const channelData = decodedAudioData.getChannelData(0);
	const channelDataInt16 = new Int16Array(channelData.length);

	for (let i = 0; i < channelData.length; i++) {
		channelDataInt16[i] = Math.max(-1, Math.min(1, channelData[i])) * 32767; // Convert to 16-bit PCM
	}

	wav.fromScratch(1, decodedAudioData.sampleRate, '16', channelDataInt16);

	// Convert to binary WAV format
	const wavBuffer = wav.toBuffer();
	const wavBlob = new Blob([wavBuffer], { type: 'audio/wav' });

	return wavBlob;
};

const getWaveAsBase64 = async (waveBlob) => {
	return new Promise((resolve, reject) => {
		const reader = new FileReader();
		reader.readAsDataURL(waveBlob);
		reader.onloadend = () => {
			resolve(reader.result);
		};
		reader.onerror = (error) => {
			reject(error);
		};
	});
};

const Broadcaster = ({ socket }) => {
	const { startRecording, stopRecording, recordingBlob, isRecording } = useAudioRecorder();
	const recordingInterval = useRef(null);
	const webcamRef = useRef(null);

	const [audioBlob, setAudioBlob] = useState(null);
	const [isBabyCrying, setIsBabyCrying] = useState(false);
	const [audioSong, setAudioSong] = useState('baby-lullaby.mp3');
	const [isAudioPlaying, setIsAudioPlaying] = useState(false);

	const sendFrame = async () => {
		if (
			webcamRef.current &&
			webcamRef.current.getScreenshot &&
			socket &&
			socket.readyState === WebSocket.OPEN
		) {
			const screenshot = webcamRef.current.getScreenshot();
			if (screenshot) {
				const base64Frame = screenshot.split(',')[1]; // Remove the data:image/jpeg;base64, part
				socket.send(JSON.stringify({ video: base64Frame }));
				// console.log('Full data URI:', screenshot);
				// console.log('Base64 data:', base64Frame);
			}
		}
	};

	const playAudio = async () => {
		if (!isAudioPlaying) {
			const audio = new Audio(audioSong);
			audio.play();
			setIsAudioPlaying(true);

			audio.onended = () => {
				setIsAudioPlaying(false);
			};
		}
	};

	// Use Effect for starting a recording
	useEffect(() => {
		const manageRecording = () => {
			if (!isRecording) {
				startRecording();
				console.log('Recording started');
			}

			if (isRecording) {
				recordingInterval.current = setTimeout(() => {
					stopRecording();
					console.log('Recording stopped');
				}, 5000);
			}
		};

		manageRecording();

		// Cleanup the timeout on component unmount or when isRecording changes
		return () => {
			clearTimeout(recordingInterval.current);
		};
	}, [isRecording, startRecording, stopRecording, recordingBlob, setAudioBlob]);

	// Use Effect for converting the recording to WAV and sending it to the server after recording is stoped
	useEffect(() => {
		if (recordingBlob && audioBlob !== recordingBlob) {
			setTimeout(async () => {
				setAudioBlob(recordingBlob);

				const wavBlob = await convertOggToWav(recordingBlob);
				const b64 = await getWaveAsBase64(wavBlob);
				const response = await fetch('http://34.101.110.106/api/audio_prediction/', {
					method: 'POST',
					headers: {
						'Content-Type': 'application/json',
					},
					body: JSON.stringify({ b64 }),
				});

				const data = await response.json();
				console.log(data);

				setIsBabyCrying(data['prediction'] === 'Yes');
				setAudioSong(
					data['current_song'] === '' ? 'baby-lullaby.mp3' : data['current_song']
				);

				console.log(`isBabyCrying? ${isBabyCrying}`);
			}, 1000);
		}
	}, [recordingBlob, startRecording, audioBlob, setAudioBlob, setIsBabyCrying]);

	useEffect(() => {
		if (isBabyCrying) playAudio();
	}, [isBabyCrying]);

	useEffect(() => {
		const interval = setInterval(() => {
			sendFrame();
		}, 1000 / 60); // 60 fps

		return () => clearInterval(interval);
	}, [socket]);

	return (
		<div>
			<Webcam audio={false} ref={webcamRef} screenshotFormat="image/jpeg" />
			<h2>Is Baby Crying? {isBabyCrying ? 'YES' : 'NO'}</h2>
		</div>
	);
};

export default Broadcaster;
