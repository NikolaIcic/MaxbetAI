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
        this.TicketsPlayed = [];

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
            this.Predictions.push(result);
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

        this.TicketsPlayed.push({
            ticket: this.Ticket,
            predictions: this.Predictions
        });
    }

    saveData(filepath) {
        if (this.Name == 'Agent')
            this.Name = generateRandomName();

        let text = this.Name + '\n';
        this.NN.Weights.forEach(WeightLevel => {
            WeightLevel.forEach(weight => {
                text += weight + ',';
            });
        });
        fs.writeFileSync(filepath, text);
    }

    loadData(filepath) {
        let data = fs.readFileSync(filepath, 'utf8', function (err, data) {
            if (err) throw err;
            return data;
        });
        let agentData = data.split('\n');
        this.Name = agentData[0];
        this.NN.setWeights(agentData[1].split(','));
    }

    saveStats(filepath) {
        let stats = {
            agentName: this.Name,
            tickets: this.TicketsPlayed
        };
        let data = JSON.stringify(stats);
        fs.writeFileSync(filepath, data);
        this.TicketsPlayed = [];
    }
}

const getPredictionInputs = (predictions) => {
    let quotes = [];
    for (let i = 1; i < predictions.length; i++)
        quotes.push(predictions[i].Quote);
    return quotes;
}