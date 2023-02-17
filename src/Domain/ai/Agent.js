import generateRandomName from "./generateRandomName.js";
import NeuralNetwork from "./NeuralNetwork.js"
import fs from 'fs'

export default class Agent {
    constructor() {
        this.Name = 'Agent'
        this.NN = new NeuralNetwork();
        this.Ticket = null;

        this.GamesPlayed = 0;
        this.Predictions = [];
        this.CurrentQuote = 1;

        this.TotalGames = 0;
        this.TotalTickets = 0;
        this.CorrectGamePredictions = 0;
        this.CorrectTicketPredictions = 0;
        this.HighestQuotePredicted = 1;
        this.TotalQuotesSum = 0;
        this.Fitness = 0;
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
            let result = game.predictions[resultIndex];
            this.Predictions.push(result); // create a complex object instead with more game data?
            this.CurrentQuote *= result.Quote;
            if (resultIndex > 0)
                this.GamesPlayed++;

            this.TotalGames++;
            if (result.Result && resultIndex != 0)
                this.CorrectGamePredictions++;
        });
        this.TotalTickets++;
        let correct = true;
        this.Predictions.forEach(pred => {
            if (!pred.Result)
                correct = false;
        });
        if (correct && this.CurrentQuote != 1) {
            this.CorrectTicketPredictions++;
            if (this.CurrentQuote > this.HighestQuotePredicted)
                this.HighestQuotePredicted = this.CurrentQuote;
        }
        this.TotalQuotesSum += this.CurrentQuote;
    }

    saveData() {
        if (this.Name == 'Agent')
            this.Name = generateRandomName();

        fs.writeFile('./Agent1.txt','Hello world');
    }

    loadData() {

    }
}

const getPredictionInputs = (predictions) => {
    let quotes = [];
    for (let i = 1; i < predictions.length; i++)
        quotes.push(predictions[i].Quote);
    return quotes;
}