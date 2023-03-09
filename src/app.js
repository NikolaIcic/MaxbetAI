import Mai from "./Domain/core/Mai.js";
import express from "express";
import { Worker } from 'worker_threads';

const app = express()
const port = 3690;

app.get('/mai/start', (req, res) => {
    res.send('Mai started learning');
    const worker = new Worker('./src/Workers/learning.js', {
        workerData: {
            newTraining: true,
            folderName: 'TestGeneration'
        }
    });
    worker.on('message', (result) => {
        console.log(result);
    })
})

app.get('/mai/test', (req, res) => {
    const mai = new Mai();
    mai.test2();
    res.send('Test Done');
})

app.listen(port, () => {
    console.log(`Mai app hosted on port ${port}`)
})