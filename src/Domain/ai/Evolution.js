import Agent from "./Agent.js";

export default class Evolution {
    constructor() {
        this.Agents = [];
    }

    createAgents(count) {
        for (let i = 0; i < count; i++)
            this.Agents.push(new Agent());
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
            if(averageQuote > 25)
                averageQuote = 25;
            let highestCorrect = agent.HighestQuotePredicted;
            if(highestCorrect > 100)
                highestCorrect = 100;

            fitness += gameWR * 3000;
            fitness += ticketWR * 10000;
            fitness += averageQuote * 50; 
            fitness += highestCorrect * 10;
            agent.Fitness = fitness;
        });
    }
}