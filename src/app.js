import Mai from "./Domain/core/Mai.js";
import express from "express";
import { Worker } from 'worker_threads';

const app = express()
const port = 3690;

app.get('/mai/start', (req, res) => {
    res.send('Mai started learning');
    const worker = new Worker('./src/Workers/learning.js', {
        workerData: {
            newTraining: true
        }
    });
    worker.on('message', (result) => {
        res.send('Learning done',result);
    })
})

app.get('/mai/test', (req, res) => {
    const mai = new Mai();
    mai.learn(true);
    res.send('Test done');
})

app.listen(port, () => {
    console.log(`Mai app hosted on port ${port}`)
})