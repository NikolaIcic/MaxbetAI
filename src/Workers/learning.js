import Mai from '../Domain/core/Mai.js';
import { parentPort,workerData } from 'worker_threads'

const mai = new Mai();
console.log('started learning...');
mai.learn(workerData.newTraining);
parentPort.postMessage('Jobs done!');