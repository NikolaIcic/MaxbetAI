import RandomGame from "./randomGame.js";

export default class GameGenerator {
    constructor() {
        this.Games = [];
    }

    CreateGames(count) {
        for (let i = 0; i < count; i++)
            this.Games.push(new RandomGame());
        return this.Games;
    }
}

