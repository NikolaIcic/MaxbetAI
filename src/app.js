import Mai from "./Domain/core/Mai.js";
import express from "express";
import cors from 'cors';
import { Worker } from 'worker_threads';

const app = express()
const port = 3690;

let workers = [];

const initialSetup = () => {
    let maiInitial = new Mai();
    let learningGroups = maiInitial.getLearningGroups();
    learningGroups.forEach(group => {
        maiInitial.stopStartLearningGroup(group.folderName);
    });
}
initialSetup();

app.use(cors({
    origin: 'http://localhost:3000'
}));

app.get('/mai/learning/start/:name/:algorithm/:newTraining', (req, res) => {
    if (workers.find(x => x.groupName == req.params.name))
        return res.send('error');
    let newTraining = req.params.newTraining === 'true';
    const worker = new Worker('./src/Workers/learning.js', {
        workerData: {
            newTraining: newTraining,
            folderName: req.params.name,
            fitnessAlgorithm: req.params.algorithm
        }
    });
    workers.push({ worker: worker, groupName: req.params.name });
    const mai = new Mai();
    mai.stopStartLearningGroup(req.params.name, true);
    res.send('success');
})

app.get('/mai/learning/stop/:name', (req, res) => {
    if (!workers.find(x => x.groupName == req.params.name))
        return res.send('error');;
    const mai = new Mai();
    let currentWorker = workers.find(x => x.groupName == req.params.name).worker;
    currentWorker.terminate();
    workers = workers.filter(x => x.groupName != req.params.name);
    mai.stopStartLearningGroup(req.params.name);
    res.send('success');
})

app.get('/mai/learning/list', (req, res) => {
    const mai = new Mai();
    const groups = mai.getLearningGroups();
    res.send(groups);
})

app.get('/mai/test', (req, res) => {
    const mai = new Mai();
    mai.learn(false, 'TestGeneration', 'Default');
})

app.get('/mai/agents/groups', (req, res) => {
    const mai = new Mai();
    res.json(mai.getAgentGroups());
})

app.get('/mai/agents/list/:agentGroup', (req, res) => {
    const mai = new Mai();
    let result = mai.getAgents(req.params.agentGroup);
    res.json(result);
})

app.get('/mai/agents/list', (req, res) => {
    const mai = new Mai();
    let result = mai.getAllAgents();
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