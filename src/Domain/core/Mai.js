import Evolution from "../ai/Evolution.js";
import RandomGame from "../random/randomGame.js";
import Ticket from "./Ticket.js";

const NumOfAgents = 10;
const TicketsPerRound = 1;
const GamesPerTicket = 5;

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

        // create new Agents
        if (newTraining)
            this.Evolution.createAgents(NumOfAgents);

        // create new tickets
        this.createTickets();

        // agents play tickets
        this.Tickets.forEach(ticket => {
            // agents play single ticket
            this.Evolution.agentsPlayTicket(ticket);

            // check results

            // update Agent data (W/L etc...)
        });

        // calculate fitness

        // save data (Agent NN + statistics)

        // evolve...

        // learn...
    }

}