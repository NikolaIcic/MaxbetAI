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

app.get('/mai/learning/start/:name/:algorithm', (req, res) => {
    res.send('Mai started learning');
    const worker = new Worker('./src/Workers/learning.js', {
        workerData: {
            newTraining: true,
            folderName: req.params.name,
            fitnessAlgorithm: req.params.algorithm
        }
    });
    workers.push(worker);
    learningGroups.push({name:'TestGeneration',learningAlgorithm:'Default',id:learningGroups.length});

    worker.on('message', (result) => {
        console.log(result);
    })
})

app.get('/mai/learning/list', (req, res) => {
    const mai = new Mai();
    const groups = mai.getLearningGroups();
    res.send(groups);
})

app.get('/mai/test', (req, res) => {
    console.log(test);
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