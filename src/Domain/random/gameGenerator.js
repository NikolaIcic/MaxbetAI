import Game from '../core/Game.js';
import Prediction from '../core/Prediction.js'

const outcomes = ['N', '1', 'X', '2', '2+','3+','0-2','GG'];

export default class GameGenerator {
    constructor() {
        this.Games = [];
    }

    CreateGames(count, numOfPredictions) {
        for (let i = 0; i < count; i++) {
            this.Games.push(generateGame(i, numOfPredictions));
        }
    }
}

const generateGame = (index, numOfPredictions) => {
    let game = new Game();
    game.Name = `Game${index}`;
    for (let i = 0; i < numOfPredictions; i++) {
        let p = new Prediction();
        p.Name = outcomes[i];
        switch (i) {
            case 0:
                p.Quote = 1;
                break;
            case 1:
                break;
            case 2:
                break;
            case 3:
                break;
            case 4:
                break;
            case 5:
                break;
            case 6:
                break;
            case 7:
                break;
            case 8:
                break;
            case 9:
                break;
        }
    }
    return game;
}

const GetRandomPredictions = () => {
    
}