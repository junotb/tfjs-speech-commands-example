"use client";

import { useSpeechRecognizer } from "@/hooks/useSpeechRecognizer";

export default function SpeechRecognizer() {
  const { recognizer, listening, result, probabilities, startListening, stopListening } = useSpeechRecognizer();

  return (
    <div className="flex flex-col items-center justify-center w-full h-full">
      <button
        type="button"
        onClick={listening ? stopListening : startListening}
        className="p-3 m-1 text-xl text-black bg-white border border-black rounded-md dark:border-white dark:bg-black dark:text-white"
      >
        {listening ? "음성 인식 중지" : "음성 인식 시작"}
      </button>
      <div className="mt-6">
        <div className="font-bold mb-2">결과:</div>
        <div className="text-2xl">{result ? result : "..."}</div>
        {probabilities && (
          <ul className="mt-2">
            {probabilities.map(({ label, prob }) => (
              <li key={label}>
                {label}: {prob}
              </li>
            ))}
          </ul>
        )}
      </div>
      <p className="text-sm text-gray-500 mt-6">
        인식 가능한 단어: {recognizer ? recognizer.wordLabels().join(", ") : ""}
      </p>
    </div>
  );
}