import React from "react";
import SpeechRecognition, {
  useSpeechRecognition,
} from "react-speech-recognition";

export default function SpeechToText() {
  const {
    transcript,
    listening,
    resetTranscript,
    browserSupportsSpeechRecognition,
  } = useSpeechRecognition();

  if (!browserSupportsSpeechRecognition) {
    return <span>Browser doesn't support speech recognition.</span>;
  }

  return (
    <div>
      <p>Microphone: {listening ? "on" : "off"}</p>
      <button
        className="custom-button btn-13"
        onClick={SpeechRecognition.startListening}
      >
        Start
      </button>
      <button
        className="custom-button btn-13"
        onClick={SpeechRecognition.stopListening}
      >
        Stop
      </button>
      <button className="custom-button btn-13" onClick={resetTranscript}>
        Reset
      </button>
      <p>{transcript}</p>
    </div>
  );
}
