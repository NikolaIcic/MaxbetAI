const ticketStatsCount = 10;

export default class AgentStats {
    constructor(agentName,tickets) {
        this.Name = agentName;
        this.TicketsPlayed = tickets.slice(0,ticketStatsCount);

        this.CorrectGamesPredicted = 0;
        this.CorrectTicketsPredicted = 0;
        this.TotalTicketsPlayed = tickets.length;
        this.TotalGamesPlayed = 0;
    }
}