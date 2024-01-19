'use client';

import { useRef, useState } from 'react';

const fs = require('fs');
const tf = require('@tensorflow/tfjs');
const speechCommands = require('@tensorflow-models/speech-commands');

export default function Home() {
  const [onListen, setOnListen] = useState(false);
  
  let recognizer;
  recognizer = speechCommands.create('BROWSER_FFT');

  // Make sure the tf.Model is loaded through HTTP. If this is not
  // called here, the tf.Model will be loaded the first time
  // `listen()` is called.
  recognizer.ensureModelLoaded()
    .then(() => {
      console.log('Model loaded.');

      const params = recognizer.params();
      console.log(`sampleRateHz: ${params.sampleRateHz}`);
      console.log(`fftSize: ${params.fftSize}`);
      console.log(
        `spectrogramDurationMillis: ` +
        `${params.spectrogramDurationMillis.toFixed(2)}`);
      console.log(
        `tf.Model input shape: ` +
        `${JSON.stringify(recognizer.modelInputShape())}`);
    })
    .catch(err => {
      console.log(
        'Failed to load model for recognizer: ' + err.message);
    });

  const startHandler = () => {
    console.log(recognizer.wordLabels());

    const suppressionTimeMillis = 1000;
    recognizer
      .listen(
        result => {
          console.log(recognizer.wordLabels());
          console.log(result.scores);
        },
        {
          includeSpectrogram: true,
          suppressionTimeMillis,
          probabilityThreshold: 0.75
        })
      .then(() => {
        setOnListen(true);
        console.log('Streaming recognition started.');
      })
      .catch(err => {
        console.log(
          'ERROR: Failed to start streaming display: ' + err.message);
      });
  };

 const stopHandler = () => {
    recognizer.stopListening()
      .then(() => {
        setOnListen(false);
        console.log('Streaming recognition stopped.');
      })
      .catch(err => {
        console.log(
          'ERROR: Failed to stop streaming display: ' + err.message);
      });
  };

  return (
    <div className='flex justify-center items-center w-full h-screen'>
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
  );
}
