import Ticket from "./core/Ticket.js";
import Game from "./core/Game.js";
import Prediction from "./core/Prediction.js";

let ticket = new Ticket();
let game = new Game();
let pred1 = new Prediction();

pred1.Name = 'X';
pred1.Quote = 1.5;

game.Name = 'Test';
game.Predicted = 0;
game.Predictions.push(pred1);

ticket.Games.push(game);
console.log(ticket.GetQuote());
