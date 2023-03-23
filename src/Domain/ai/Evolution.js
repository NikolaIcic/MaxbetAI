import Agent from "./Agent.js";
import fs from 'fs'

export default class Evolution {
    constructor() {
        this.Agents = [];
    }

    createNewAgents(count) {
        for (let i = 0; i < count; i++)
            this.Agents.push(new Agent());
    }

    createNextGenerationAgents(count, topCount, property) {
        this.Agents.sort((a, b) => b[property] - a[property]);
        this.Agents.splice(topCount);
        for (let i = 0; i < count / 2; i++) {
            let rand = getRandomInteger(1, 4);
            switch (rand) {
                case 1:
                    this.createCombinationA(topCount);
                    break;
                case 2:
                    this.createCombinationB(topCount);
                    break;
                case 3:
                    this.createCombinationB(topCount); // change this to C
                    break;
                case 4:
                    this.createMutation(topCount);
                    break;
            }
        }
        this.createNewAgents(count);
    }

    createCombinationA(topCount) {
        let agent = new Agent();
        let rand = getRandomInteger(0, topCount - 1);
        this.copyWeights(agent, this.Agents[rand]);
        for (let i = 0; i < agent.NN.Weights.length; i++)
            for (let j = 0; j < agent.NN.Weights[i].length; j++)
                if (getRandomArbitrary(0, 1) > 0.8)
                    agent.NN.Weights[i][j] = getRandomArbitrary(-1.2, 1.2);
        this.Agents.push(agent);
    }
    createCombinationB(topCount) {
        let agent = new Agent();
        let rand = getRandomInteger(0, topCount - 1);
        this.copyWeights(agent, this.Agents[rand]);
        for (let i = 0; i < agent.NN.Weights.length; i++)
            for (let j = 0; j < agent.NN.Weights[i].length; j++)
                if (getRandomArbitrary(0, 1) > 0.6)
                    agent.NN.Weights[i][j] += getRandomArbitrary(-0.3, 0.3);
        this.Agents.push(agent);
    }
    createCombinationC(topCount) {
        // needs to be more chaotic or combined with agents from another fitness function
    }
    createMutation(topCount) {
        let agent = new Agent();
        let rand = getRandomInteger(0, topCount - 1);
        this.copyWeights(agent, this.Agents[rand]);
        for (let i = 0; i < agent.NN.Weights.length; i++)
            for (let j = 0; j < agent.NN.Weights[i].length; j++)
                if (getRandomArbitrary(0, 1) > 0.9)
                    agent.NN.Weights[i][j] *= -1;
        this.Agents.push(agent);
    }
    copyWeights(agent1, agent2) {
        for (let i = 0; i < agent1.NN.Weights.length; i++)
            for (let j = 0; j < agent1.NN.Weights[i].length; j++)
                agent1.NN.Weights[i][j] = agent2.NN.Weights[i][j];
    }

    loadAgents(numOfAgents, topCount, folderPath) {
        this.createNewAgents(numOfAgents);
        for (let i = 0; i < topCount; i++)
            this.Agents[i].loadData(folderPath + '/Agent' + (i + 1) + '.txt');
    }

    saveAgents(folderPath, count, property) {
        if (!fs.existsSync(folderPath))
            fs.mkdirSync(folderPath)
        this.Agents.sort((a, b) => b[property] - a[property]);
        for (let i = 0; i < count; i++) {
            this.Agents[i].saveData(folderPath + '/Agent' + (i + 1) + '.txt');
            this.Agents[i].saveStats(folderPath + '/Agent' + (i + 1) + '.json');
        }
    }

    agentsPlayTicket(ticket) {
        this.Agents.forEach(agent => {
            agent.Ticket = ticket;
            agent.predictTicketOutcome();
        });
    }

    calculateAgentsFitness() {
        this.Agents.forEach(agent => {
            let fitness = 0;
            let gameWR = agent.CorrectGamePredictions / agent.TotalGames;
            let ticketWR = agent.CorrectTicketPredictions / agent.TotalTickets;
            let averageQuote = agent.TotalQuotesSum / agent.TotalTickets;
            if (averageQuote > 25)
                averageQuote = 25;
            let highestCorrect = agent.HighestQuotePredicted;
            if (highestCorrect > 100)
                highestCorrect = 100;

            fitness += gameWR * 3000;
            fitness += ticketWR * 10000;
            fitness += averageQuote * 50;
            fitness += highestCorrect * 10;
            agent.Fitness = fitness;
        });
    }
}

const getRandomInteger = (min, max) => {
    return Math.floor(Math.random() * max) + min
}

const getRandomArbitrary = (min, max) => {
    return Math.random() * (max - min) + min;
}