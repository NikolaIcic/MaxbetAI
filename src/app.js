import RandomGame from "./Domain/random/randomGame.js";
import Mai from "./Domain/core/Mai.js";
import NeuralNetwork from "./Domain/ai/NeuralNetwork.js";

// let randomGame = new RandomGame();
// console.log(randomGame);

let mai = new Mai();

mai.learn(true);

mai.test();
