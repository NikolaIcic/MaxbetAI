import NeuralNetwork from "./NeuralNetwork.js"

export default class Agent {
    constructor() {
        this.name = 'Agent'
        this.NN = new NeuralNetwork();
        this.predictionIndex = 0;
    }

    getPrediction(inputs) {
        this.NN.addInputValues(inputs);
        this.NN.calculateResult();
        this.predictionIndex = this.NN.getHighestOutputIndex();
        return this.predictionIndex;
    }

}