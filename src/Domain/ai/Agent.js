import NeuralNetwork from "./NeuralNetwork.js"

export default class Agent {
    constructor() {
        this.name = 'Agent'
        this.NN = new NeuralNetwork();
        this.gamesPlayed = 0;
        this.predictions = [];
    }

    getPrediction(inputs) {
        inputs.push(this.gamesPlayed);
        //inputs.push(totalQUote) // NEKVO NE VALJA
        this.NN.addInputValues(inputs);
        this.NN.calculateResult();
        let prediction = this.NN.getHighestOutputIndex()
        this.predictions.push(prediction);
        if(prediction != 0)
            this.gamesPlayed++;
    }

}