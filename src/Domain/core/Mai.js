import Evolution from "../ai/Evolution.js";
import RandomGame from "../random/randomGame.js";
import Ticket from "./Ticket.js";
import fs from 'fs';
import AgentStats from "../ai/AgentStats.js";

const NumOfAgents = 100;
const TicketsPerRound = 100;
const GamesPerTicket = 6;
const TopAgents = 5;
const SaveAgentsInterval = 10;

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

    learn(newTraining, folderName) {
        this.Evolution.createNewAgents(NumOfAgents);

        if (!newTraining)
            this.Evolution.loadAgents(TopAgents, './Agents' + folderName);

        let generations = 0;
        let saveCounter = 0;
        while (generations < 20) {
            this.createTickets();
            this.Tickets.forEach(ticket => {
                this.Evolution.agentsPlayTicket(ticket);
            });

            this.Evolution.calculateAgentsFitness();
            if (saveCounter == SaveAgentsInterval) {
                this.Evolution.saveAgents('./Agents/' + folderName, TopAgents, 'Fitness');
                saveCounter = 0;
            }
            this.Evolution.createNextGenerationAgents(NumOfAgents - TopAgents, TopAgents, 'Fitness');
            generations++;
            saveCounter++;
        }
    }

    getAgentGroups() {

    }

    getAgents(group) {
        if (!fs.existsSync('./Agents/' + group))
            return 'Group not found';

        let agents = [];
        for (let i = 0; i < TopAgents; i++)
            agents.push(this.loadAgentStats('./Agents/' + group + '/Agent' + (i + 1) + '.json'))
        return agents;
    }

    loadAgentStats(filepath) {
        let rawdata = fs.readFileSync(filepath);
        let data = JSON.parse(rawdata);
        let stats = new AgentStats(data.agentName, data.tickets);
        return stats;
    }

    test() {
        this.Evolution.Agents.forEach(agent => {
            console.log(agent.Name, agent.Fitness);
        });
    }
}