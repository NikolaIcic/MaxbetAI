import Mai from "./Domain/core/Mai.js";
import express from "express";
import cors from 'cors';
import { Worker } from 'worker_threads';

const app = express()
const port = 3690;

let workers = [];
let learningGroups = [];

app.use(cors({
    origin: 'http://localhost:3000'
}));

app.get('/mai/learning/start', (req, res) => {
    res.send('Mai started learning');
    const worker = new Worker('./src/Workers/learning.js', {
        workerData: {
            newTraining: true,
            folderName: 'TestGeneration',
            fitnessAlgorithm: 'Default'
        }
    });
    workers.push(worker);
    learningGroups.push({name:'TestGeneration',learningAlgorithm:'Default',id:learningGroups.length});

    worker.on('message', (result) => {
        console.log(result);
    })
})

app.get('/mai/learning/list', (req, res) => {
    res.json(learningGroups);
})

app.get('/mai/test', (req, res) => {
    const mai = new Mai();
    mai.test();
    res.send('Test Done');
})

app.get('/mai/agents/groups', (req, res) => {
    const mai = new Mai();
    res.json(mai.getAgentGroups());
})

app.get('/mai/agents/list/:agentGroup', (req, res) => {
    const mai = new Mai();
    let result = mai.getAgents(req.params.agentGroup)
    res.json(result);
})

app.get('/mai/agents/load/:group/:index', (req, res) => {
    const mai = new Mai();
    let group = req.params.group;
    let index = req.params.index;
    let result = mai.getAgent(group, index);
    res.json(result);
})

app.listen(port, () => {
    console.log(`Mai app hosted on port ${port}`)
})