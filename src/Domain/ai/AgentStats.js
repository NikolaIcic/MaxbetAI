const ticketStatsCount = 50;
const defaultBet = 100;

export default class AgentStats {
    constructor(agentName, tickets) {
        this.Name = agentName;
        this.TicketsPlayed = tickets.slice(0, ticketStatsCount);

        this.CorrectGamesPredicted = 0;
        this.CorrectTicketsPredicted = 0;
        this.GamesNotPlayed = 0;
        this.TotalGamesPlayed = 0;
        this.TotalTicketsPlayed = tickets.length;
        this.TicketsNotPlayed = 0;
        this.Money = 0;

        this.constructStats(tickets);
    }

    constructStats(tickets) {
        tickets.forEach(t => {
            this.Money -= defaultBet;
            let ticketPassed = true;
            let quote = 1;
            for (let i = 0; i < t.ticket.Games.length; i++) {
                this.TotalGamesPlayed++;
                if (t.predictions[i].Result === true) {
                    if (t.predictions[i].Quote != 1)
                        this.CorrectGamesPredicted++;
                    else
                        this.GamesNotPlayed++;
                }
                else
                    ticketPassed = false;
                quote *= t.predictions[i].Quote;
            }
            t.ticket.Quote = quote;
            if (ticketPassed) {
                if (t.ticket.Quote != 1)
                    this.CorrectTicketsPredicted++;
                else
                    this.TicketsNotPlayed++;
                this.Money += defaultBet * t.ticket.Quote;
            }
        });
    }
}