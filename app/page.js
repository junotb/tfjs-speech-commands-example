'use client';

import { useRef, useState } from 'react';

const fs = require('fs');
const tf = require('@tensorflow/tfjs');
const speechCommands = require('@tensorflow-models/speech-commands');

export default function Home() {
  const labelRef = useRef(null);
  const [onListen, setOnListen] = useState(false);
  const [words, setWords] = useState(null);

  const createModel = async () => {
    const recognizer = speechCommands.create(
      "BROWSER_FFT", // fourier transform type, not useful to change
      undefined, // speech commands vocabulary feature, not useful for your models
      '/model/model.json',
      '/model/metadata.json');

    // check that model and metadata are loaded via HTTPS requests.
    await recognizer.ensureModelLoaded();

    return recognizer;
  };

  const startHandler = async () => {
    const recognizer = await createModel();
    const classLabels = recognizer.wordLabels(); // get class labels
    for (let i = 0; i < classLabels.length; i++) {
      labelRef.current.appendChild(document.createElement("div"));
    }

    // listen() takes two arguments:
    // 1. A callback function that is invoked anytime a word is recognized.
    // 2. A configuration object with adjustable fields
    recognizer.listen(result => {
      const scores = result.scores; // probability of prediction for each class
      console.log(result);
      // render the probability scores per class
      for (let i = 0; i < classLabels.length; i++) {
        const classPrediction = classLabels[i] + ": " + result.scores[i].toFixed(2);
        labelRef.current.childNodes[i].innerHTML = classPrediction;

        console.log(labelRef.current.childNodes[i]);
      }
    }, {
      includeSpectrogram: true, // in case listen should return result.spectrogram
      probabilityThreshold: 0.75,
      invokeCallbackOnNoiseAndUnknown: true,
      overlapFactor: 0.50 // probably want between 0.5 and 0.75. More info in README
    });

    // Stop the recognition in 5 seconds.
    // setTimeout(() => recognizer.stopListening(), 5000);
  };

  const stopHandler = async () => {

  };

  return (
    <div className='flex justify-center items-center w-full h-screen'>
      <div>
        <button
          type='button'
          onClick={startHandler}
          disabled={onListen}
          className='border border-black dark:border-white m-1 p-3 rounded-md bg-white dark:bg-black text-xl text-black dark:text-white'
        >Start</button>
        <button
          type='button'
          onClick={stopHandler}
          disabled={!onListen}
          className='border border-black dark:border-white m-1 p-3 rounded-md bg-white dark:bg-black text-xl text-black dark:text-white'
        >Stop</button>
      </div>
      <div ref={labelRef}></div>
    </div>
  );
}
