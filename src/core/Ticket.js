export default class Ticket {
    constructor() {
        this.Games = [];
        this.Quote = 1;
        this.Bet = 0;
        this.Result = null;
    }

    GetQuote() {
        let qoute = 1;
        this.Games.forEach(game => {
            qoute *= game.GetQuote();
        });
        this.Quote = qoute;
        return qoute;
    }
}