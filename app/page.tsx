'use client';

import { useRef, useState } from 'react';

const fs = require('fs');
const tf = require('@tensorflow/tfjs');
const speechCommands = require('@tensorflow-models/speech-commands');

export default function Home() {
  const recognizerRef = useRef(null);
  const labelRef = useRef(null);
  const [onListen, setOnListen] = useState(false);
  const [words, setWords] = useState(null);

  const createModel = async () => {
    const recognizer = speechCommands.create(
      "BROWSER_FFT", // fourier transform type, not useful to change
      undefined, // speech commands vocabulary feature, not useful for your models
      `${process.env.NEXT_PUBLIC_HOST}/model/model.json`,
      `${process.env.NEXT_PUBLIC_HOST}/model/metadata.json`);

    // check that model and metadata are loaded via HTTPS requests.
    await recognizer.ensureModelLoaded();

    return recognizer;
  };

  const startHandler = async () => {
    if (!recognizerRef.current) {
      recognizerRef.current = await createModel();
    }
    
    const classLabels = recognizerRef.current.wordLabels(); // get class labels
    for (let i = 0; i < classLabels.length; i++) {
      labelRef.current.appendChild(document.createElement("div"));
    }

    // listen() takes two arguments:
    // 1. A callback function that is invoked anytime a word is recognized.
    // 2. A configuration object with adjustable fields
    recognizerRef.current.listen(result => {
      const scores = result.scores; // probability of prediction for each class
      // render the probability scores per class
      for (let i = 0; i < classLabels.length; i++) {
        const classPrediction = classLabels[i] + ": " + result.scores[i].toFixed(2);
        labelRef.current.childNodes[i].innerHTML = classPrediction;
      }
    }, {
      includeSpectrogram: true, // in case listen should return result.spectrogram
      probabilityThreshold: 0.75,
      invokeCallbackOnNoiseAndUnknown: true,
      overlapFactor: 0.50 // probably want between 0.5 and 0.75. More info in README
    });

    setOnListen(true);
  };

  const stopHandler = async () => {
    recognizerRef.current.stopListening();

    setOnListen(false);
  };

  return (
    <div className='flex flex-col items-center justify-center w-full h-screen'>
      <div>
        <button
          type='button'
          onClick={startHandler}
          disabled={onListen}
          className='p-3 m-1 text-xl text-black bg-white border border-black rounded-md dark:border-white dark:bg-black dark:text-white'
        >Start</button>
        <button
          type='button'
          onClick={stopHandler}
          disabled={!onListen}
          className='p-3 m-1 text-xl text-black bg-white border border-black rounded-md dark:border-white dark:bg-black dark:text-white'
        >Stop</button>
      </div>
      <div
        ref={labelRef}
        className='p-3 m-1'></div>
    </div>
  );
}
