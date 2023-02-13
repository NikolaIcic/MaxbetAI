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
        if (newTraining)
            this.Evolution.createAgents(NumOfAgents);

        // agents play ticket
        this.createTickets();
        this.Tickets.forEach(ticket => {
            let gamesCount = 0;
            ticket.Games.forEach(game => {
                let inputs = [];
                game.predictions.forEach(prediction => {
                    inputs.push(prediction.Quote);
                });
                
                this.Evolution.agentPredictResult(game.predictions);
            });
        });
        // result

        // fitness

        // save data

        // learn
    }

}