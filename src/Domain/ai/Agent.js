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
            this.Predictions.push(game.predictions[resultIndex]); // create a complex object instead with more game data?
            this.CurrentQuote *= game.predictions[resultIndex].Quote;
            if(resultIndex > 0)
                this.GamesPlayed++;
        });
    }
}

const getPredictionInputs = (predictions) => {
    let quotes = [];
    for(let i=1;i<predictions.length;i++)
        quotes.push(predictions[i].Quote);
    return quotes;
}