import RandomGame from "./Domain/random/randomGame.js";
import Mai from "./Domain/core/Mai.js";
import NeuralNetwork from "./Domain/ai/NeuralNetwork.js";
import Agent from "./Domain/ai/Agent.js";

// let randomGame = new RandomGame();
// console.log(randomGame);

let mai = new Mai();

mai.learn(true);

//mai.test();

// let agent = new Agent();
// agent.loadData('./Agents/Agent1.txt')

//agent.saveData('./Agents/Agent1.txt');