import Evolution from "../ai/Evolution.js";
import RandomGame from "../random/randomGame.js";
import Ticket from "./Ticket.js";
import fs, { readdirSync } from 'fs';
import AgentStats from "../ai/AgentStats.js";
import path from "path";

const NumOfAgents = 100;
const TicketsPerRound = 100;
const GamesPerTicket = 6;
const TopAgents = 5;
const SaveAgentsInterval = 50;

export default class Mai {
    constructor() {
        this.Tickets = [];
        this.Evolution = new Evolution();
    }

    createTickets() {
        this.Tickets = [];
        for (let i = 0; i < TicketsPerRound; i++) {
            let ticket = new Ticket();
            for (let j = 0; j < GamesPerTicket; j++)
                ticket.Games.push(new RandomGame())
            this.Tickets.push(ticket);
        }
    }

    learn(newTraining, folderName, fitnessAlgorithm) {
        this.Evolution.createNewAgents(NumOfAgents);

        this.checkIfGenerationExists(folderName, fitnessAlgorithm);
        let learningGroup = this.getLearningGroups().find(x => x.folderName == folderName);
        this.updateLearningGroup(folderName, { ...learningGroup, learning: true, generation: newTraining ? 0 : learningGroup.generation })
        if (!newTraining)
            this.Evolution.loadAgents(TopAgents, './Agents/' + folderName);

        let generation = newTraining ? 0 : learningGroup.generation;
        let saveCounter = 0;
        while (true) {
            this.Evolution.resetAllAgentStats();
            this.createTickets();
            this.Tickets.forEach(ticket => {
                this.Evolution.agentsPlayTicket(ticket);
            });

            this.Evolution.calculateAgentsFitness(fitnessAlgorithm);
            if (saveCounter == SaveAgentsInterval) {
                generation++;
                this.Evolution.saveAgents('./Agents/' + folderName, TopAgents, 'Fitness');
                this.updateLearningGroup(folderName, { ...learningGroup, generation: generation, learning: true });
                saveCounter = 0;
            }
            this.Evolution.createNextGenerationAgents(NumOfAgents - TopAgents, TopAgents, 'Fitness');
            saveCounter++;
        }
    }

    getLearningGroups() {
        if (!fs.existsSync('./Agents'))
            return [];
        let folders = readdirSync('./Agents', { withFileTypes: true })
            .filter(file => file.isDirectory())
            .map(dir => dir.name);
        let res = [];
        folders.forEach(folder => {
            let rawdata = fs.readFileSync('./Agents/' + folder + '/Generation.json');
            let data = JSON.parse(rawdata);
            res.push(data);
        });
        return res;
    }

    updateLearningGroup(folderName, groupData) {
        let data = JSON.stringify(groupData);
        fs.writeFileSync('./Agents/' + folderName + '/Generation.json', data);
    }

    async stopStartLearningGroup(folderName, start = false) {
        let learningGroup = this.getLearningGroups().find(x => x.folderName == folderName);
        this.updateLearningGroup(folderName, { ...learningGroup, learning: start })
    }

    checkIfGenerationExists(folderName, fitnessAlgorithm) {
        if (!fs.existsSync('./Agents'))
            fs.mkdirSync('./Agents');
        if (!fs.existsSync('./Agents/' + folderName)) {
            fs.mkdirSync('./Agents/' + folderName)
            let data = JSON.stringify({
                folderName: folderName,
                fitnessAlgorithm: fitnessAlgorithm,
                generation: 0,
                learning: true,
            });
            fs.writeFileSync('./Agents/' + folderName + '/Generation.json', data);
        }
    }

    getAgentGroups() {
        return readdirSync('./Agents', { withFileTypes: true })
            .filter(file => file.isDirectory())
            .map(dir => dir.name)
    }

    getAgents(group) {
        if (!fs.existsSync('./Agents/' + group))
            return 'Group not found';

        let agents = [];
        for (let i = 0; i < TopAgents; i++)
            agents.push(this.loadAgentStats('./Agents/' + group + '/Agent' + (i + 1) + '.json'))
        return agents;
    }

    getAllAgents() {
        if (!fs.existsSync('./Agents'))
            return [];
        let folders = readdirSync('./Agents', { withFileTypes: true })
            .filter(file => file.isDirectory())
            .map(dir => dir.name);
        let res = [];
        folders.forEach(folder => {
            let files = readdirSync('./Agents/' + folder, { withFileTypes: true })
            .filter(file => file.isFile())
            .map(dir => dir.name);
            files = files.filter(x=>x.includes('.txt'));
            let agentNames = [];
            files.forEach(file => {
                let data = fs.readFileSync('./Agents/' + folder + '/' + file, 'utf8', function (err, data) {
                    if (err) throw err;
                    return data;
                });
                let name = data.split('\n')[0];
                agentNames.push(name)
            });
            res.push({
                name:folder,
                agents:agentNames
            });
        });
        return res;
    }

    getAgent(group, index) {
        return this.loadAgentStats('./Agents/' + group + '/Agent' + index + '.json');
    }

    loadAgentStats(filepath) {
        let rawdata = fs.readFileSync(filepath);
        let data = JSON.parse(rawdata);
        let stats = new AgentStats(data.agentName, data.tickets);
        return stats;
    }

    agentsPlayTicket(ticket, group) {
        if (!fs.existsSync('./Agents/' + group))
            return 'Group not found';

        this.Evolution.loadAgents(TopAgents, './Agents/' + folderName);
        this.Evolution.agentsPlayTicket(ticket);
    }
}