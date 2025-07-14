import { useState, useEffect } from "react";

export function useSpeechRecognizer() {
  const [recognizer, setRecognizer] = useState<any>();
  const [listening, setListening] = useState(false);
  const [result, setResult] = useState<string | null>(null);
  const [probabilities, setProbabilities] = useState<any>(null);

  useEffect(() => {
    async function loadRecognizer() {
      if (typeof window === "undefined" || !window.speechCommands) return;
      const recognizer = window.speechCommands.create("BROWSER_FFT");
      await recognizer.ensureModelLoaded();
      setRecognizer(recognizer);
    }
    loadRecognizer();
  }, []);

  // 음성 인식 시작
  const startListening = async () => {
    if (!recognizer) return;
    setResult(null);
    setListening(true);
    recognizer.listen(
      (result: any) => {
        const scores = result.scores as Float32Array;
        const labels = recognizer.wordLabels();
        const topIdx = scores.indexOf(Math.max(...scores));
        setResult(labels[topIdx]);
        setProbabilities(
          labels.map((label: string, i: number) => ({
            label,
            prob: scores[i].toFixed(2)
          }))
        );
      },
      {
        probabilityThreshold: 0.75, // 필요한 확률 임계값 설정
        overlapFactor: 0.5, // 음성 인식 중첩 비율 설정
        includeSpectrogram: false, // spectrogram이 필요하지 않으므로 false로 설정
        invokeCallbackOnNoiseAndUnknown: true, // 잡음 및 알 수 없는 음성에 대한 콜백 호출
      }
    );
  };

  // 음성 인식 중지
  const stopListening = async () => {
    if (recognizer) {
      await recognizer.stopListening();
      setListening(false);
    }
  };

  return { recognizer, listening, result, probabilities, startListening, stopListening };
}