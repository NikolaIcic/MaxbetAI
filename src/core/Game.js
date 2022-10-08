export default class Game {
    constructor() {
        this.ID = '';
        this.Name = '';
        this.Predictions = [];
        this.Predicted = null; // index
        this.Result = null;
    }

    GetPredictionResult(results) {
        if (this.Predictions.length == results.length) {
            for (let i = 0; i < this.Predictions.length; i++)
                this.Predictions[i].Result = results[i].Result;
            this.Result = this.Predictions[this.Predicted].Result;
            return;
        }
        console.log('On GetPredictionResult: Prediction lengths do not match');
    }

    GetQuote() {
        return this.Predictions[this.Predicted].Quote;
    }
}