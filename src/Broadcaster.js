import React, { useEffect, useRef, useState } from 'react';
import { useAudioRecorder } from 'react-audio-voice-recorder';
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

const AudioRecorder = () => {
	const { startRecording, stopRecording, recordingBlob, isRecording } = useAudioRecorder();
	const recordingInterval = useRef(null);

	const [audioBlob, setAudioBlob] = useState(null);
	const [isBabyCrying, setIsBabyCrying] = useState(false);

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
				setIsBabyCrying(data['prediction'] === 'Yes');
			}, 1000);
		}
	}, [recordingBlob, startRecording, audioBlob, setAudioBlob, setIsBabyCrying]);

	return (
		<div>
			<p>Is Baby Crying?: {isBabyCrying ? 'Yes' : 'No'}</p>
			{recordingBlob && <audio src={URL.createObjectURL(recordingBlob)} controls />}
		</div>
	);
};

export default AudioRecorder;
