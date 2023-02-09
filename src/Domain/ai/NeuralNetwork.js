const NumOfInputs = 9;
const NumOfOutputs = 8;
const NumOfHiddenLayers = 2;
const NodesPerHL = 8;
const WeightMinValue = -1;
const WeightMaxValue = 1;

export default class NeuralNetwork {
    constructor() {
        this.Bias = [];
        this.Weights = [];

        this.setupBias();
        this.setupWeights();
    }

    setupBias() {
        for (let i = 0; i < NumOfHiddenLayers + 2; i++)
            this.Bias.push([]);
        for (let i = 0; i < NumOfInputs; i++)
            this.Bias[0].push(0);
        for (let i = 0; i < NumOfHiddenLayers; i++)
            for (let j = 0; j < NodesPerHL; j++)
                this.Bias[i].push(0);
        for (let i = 0; i < NumOfOutputs; i++)
            this.Bias[NumOfHiddenLayers + 1].push(0);
    }

    setupWeights() {
        for (let i = 0; i < NumOfHiddenLayers + 1; i++)
            this.Weights.push([]);
        for (let i = 0; i < NumOfInputs * NodesPerHL; i++)
            this.Weights[0].push(getRandomWeight());
        for (let i = 1; i < NumOfHiddenLayers; i++)
            for (let j = 0; j < NodesPerHL * NodesPerHL; j++)
                this.Weights[i].push(getRandomWeight());
        for (let i = 0; i < NumOfOutputs * NodesPerHL; i++)
            this.Weights[NumOfHiddenLayers].push(getRandomWeight());
    }

    addInputValues(inputs) {
        if (NumOfInputs != inputs.length)
            return console.log('Error: Number of inputs give does not match with NN');
        for (let i = 0; i < inputs.length; i++)
            this.Bias[0][i] = inputs[i];
    }

    getResult() {
        // Calculate
        // MAX(Bias[Bias.length-1])
    }
}

const getRandomWeight = () => {
    return getRandomArbitrary(WeightMinValue, WeightMaxValue);
}

const getRandomArbitrary = (min, max) => {
    return Math.random() * (max - min) + min;
}