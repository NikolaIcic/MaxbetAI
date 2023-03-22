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

app.get('/mai/agents/groups', (req, res) => {
    res.json(['Test1', 'Test2', 'Test3']);
})

app.get('/mai/agents/list/:agentGroup', (req, res) => {
    const mai = new Mai();
    let result = mai.getAgents(req.params.agentGroup)
    res.json(result);
})

app.listen(port, () => {
    console.log(`Mai app hosted on port ${port}`)
})