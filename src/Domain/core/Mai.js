import Evolution from "../ai/Evolution.js";
import RandomGame from "../random/randomGame.js";
import Ticket from "./Ticket.js";

const NumOfAgents = 2;
const TicketsPerRound = 10;
const GamesPerTicket = 5;
// cap: agent=200, tickets=500, games=10

export default class Mai {
    constructor() {
        this.Tickets = [];
        this.Evolution = new Evolution();
    }

    createTickets() {
        for (let i = 0; i < TicketsPerRound; i++) {
            let ticket = new Ticket();
            for (let j = 0; j < GamesPerTicket; j++)
                ticket.Games.push(new RandomGame())
            this.Tickets.push(ticket);
        }
    }

    learn(newTraining) {
        if (newTraining)
            this.Evolution.createAgents(NumOfAgents);

        this.createTickets();
        this.Tickets.forEach(ticket => {
            this.Evolution.agentsPlayTicket(ticket);
        });
        this.Evolution.calculateAgentsFitness();
    }

    test() {
        this.Evolution.Agents.forEach(agent => {
            //console.log(agent.Predictions);
            console.log(agent.Fitness);
        });
    }



}