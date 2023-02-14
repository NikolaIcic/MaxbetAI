import Agent from "./Agent";

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
}