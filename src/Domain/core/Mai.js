import Evolution from "../ai/Evolution.js";
import RandomGame from "../random/randomGame.js";
import Ticket from "./Ticket.js";

const NumOfAgents = 1;
const TicketsPerRound = 1;
const GamesPerTicket = 10;

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
    }
    
    test(){
        this.Evolution.Agents.forEach(agent => {
            console.log(agent.Predictions);
            //console.log(agent.NN.Bias[3]);
        });
    }

}