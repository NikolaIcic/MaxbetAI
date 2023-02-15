const NumOfInputs = 9;
const NumOfOutputs = 8;
const NumOfHiddenLayers = 2;
const NodesPerHL = 8;
const WeightMinValue = -1;
const WeightMaxValue = 1;
const InputDevisionFactor = 10;

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
        for (let i = 1; i < NumOfHiddenLayers + 1; i++)
            for (let j = 0; j < NodesPerHL; j++)
                this.Bias[i].push(0);
        for (let i = 0; i < NumOfOutputs; i++)
            this.Bias[NumOfHiddenLayers + 1].push(0);
    }

    clearBias() {
        this.Bias = [];
        this.setupBias();
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
            throw Error('Error: Number of inputs given does not match with NN');
            
        this.clearBias()
        for (let i = 0; i < inputs.length; i++)
            this.Bias[0][i] = inputs[i] / InputDevisionFactor;
    }

    calculateResult() {
        for (let i = 1; i < this.Bias.length; i++)
            for (let j = 0; j < this.Bias[i].length; j++)
                for (let z = 0; z < this.Bias[i - 1].length; z++)
                    this.Bias[i][j] += this.Bias[i - 1][z] * this.Weights[i - 1][j * this.Bias[i - 1].length + z];
    }

    getHighestOutputIndex() {
        let value = -1;
        let res = 0;
        for (let i = 0; i < NumOfOutputs; i++)
            if (this.Bias[this.Bias.length - 1][i] > value) {
                res = i;
                value = this.Bias[this.Bias.length - 1][i];
            }
        return res;
    }
}

const getRandomWeight = () => {
    return getRandomArbitrary(WeightMinValue, WeightMaxValue);
}

const getRandomArbitrary = (min, max) => {
    return Math.random() * (max - min) + min;
}