import Mai from '../Domain/core/Mai.js';
import { parentPort, workerData } from 'worker_threads'

const mai = new Mai();
console.log('started learning...');
mai.learn(workerData.newTraining, workerData.folderName, workerData.fitnessAlgorithm);
parentPort.postMessage('Jobs done!');