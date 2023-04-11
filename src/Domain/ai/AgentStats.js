const ticketStatsCount = 10;
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
        this.Bet = defaultBet;
        this.HighestQuotePredicted = 1;
        this.AverageQuote = 1;
        this.AverageGamesPerTicket = 1;
        this.PredictionRates = [];

        this.constructStats(tickets);
    }

    constructStats(tickets) {
        let highestQuote = 1;
        let quoteSum = 0;

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
                this.markPrediction(t.predictions[i]);
            }
            t.ticket.Quote = quote;
            if (ticketPassed) {
                if (t.ticket.Quote != 1)
                    this.CorrectTicketsPredicted++;
                else
                    this.TicketsNotPlayed++;
                this.Money += defaultBet * t.ticket.Quote;
                if (t.ticket.Quote > highestQuote)
                    highestQuote = t.ticket.Quote;
            }
            if (t.ticket.Quote != 1)
                quoteSum += t.ticket.Quote;
        });

        this.HighestQuotePredicted = highestQuote;
        this.AverageQuote = quoteSum / (this.TotalTicketsPlayed - this.TicketsNotPlayed);
        this.AverageGamesPerTicket = (this.TotalGamesPlayed - this.GamesNotPlayed) / (this.TotalTicketsPlayed - this.TicketsNotPlayed);
    }

    markPrediction(prediction){
        let index = this.PredictionRates.findIndex(x=>x.name == prediction.Name)
        if(index == -1){
            this.PredictionRates.push({
                name:prediction.Name,
                count:1
            });
        }
        else
        this.PredictionRates[index].count++;
    }
}