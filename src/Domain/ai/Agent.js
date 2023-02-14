import NeuralNetwork from "./NeuralNetwork.js"

export default class Agent {
    constructor() {
        this.Name = 'Agent'
        this.NN = new NeuralNetwork();
        this.Ticket = null;
        this.GamesPlayed = 0;
        this.Predictions = [];
        this.CurrentQuote = 1;
    }

    predictTicketOutcome() {
        this.GamesPlayed = 0;
        this.Predictions = [];
        this.CurrentQuote = 1;
        this.Ticket.Games.forEach(game => {
            let inputs = getPredictionInputs(game.predictions);
            inputs.push(this.GamesPlayed);
            inputs.push(this.CurrentQuote);
            this.NN.addInputValues(inputs);
            this.NN.calculateResult();
            let resultIndex = this.NN.getHighestOutputIndex();
            this.Predictions.push(resultIndex);
            this.CurrentQuote *= game.predictions[resultIndex].Quote;
            if(this.resultIndex > 0)
                this.GamesPlayed++;
        });
    }
}

const getPredictionInputs = (predictions) => {
    let quotes = [];
    predictions.forEach(prediction => {
        quotes.push(prediction.Quote)
    });
    return quotes;
}