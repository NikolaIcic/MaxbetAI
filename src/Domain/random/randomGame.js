import Prediction from "../core/Prediction.js";

const fsGDiff = 0.07;
const hostDiff = 0.02;
const quoteGeneratorOffset = 3;
const maxbetMagicNumber = 0.95;
const goalsMaxCap = 7;
const minQuoteRange = [1.15, 2.8];
const results = ['N', '1', 'X', '2', '2+', '3+', '0-2', 'GG'];

export default class RandomGame {
    constructor() {
        this.expG = 2.5;
        this.expGFH = 1.2;
        this.expGSH = 1.35
        this.q1 = 1;
        this.qX = 1;
        this.q2 = 1;
        this.triplus = 1;
        this.twoplus = 1;
        this.zerotwo = 1;
        // this.gg not calculated properly

        this.resultHT = [0, 0];
        this.result = [0, 0];
        this.predictions = [];

        this.setExpectedGoals();
        this.setQuotes();
        this.setResults();
        this.setPredictions();
    }

    setExpectedGoals() {
        let rand = Math.floor(Math.random() * 10);
        let r = 1;
        if (rand < 2)
            r = getRandomArbitrary(0, 0.5);
        else if (rand >= 2 && rand < 5)
            r = getRandomArbitrary(0.6, 1.4);

        else if (rand >= 5 && rand < 9)
            r = getRandomArbitrary(1.5, 3.4);
        else
            r = getRandomArbitrary(3.5, 4.2);
        this.setExpGoalsFromRandom(r);
    }

    setExpGoalsFromRandom(r) {
        this.expG = r;
        this.expGFH = r / 2 - fsGDiff;
        if (this.expGFH < 0)
            this.expGFH = 0;
        this.expGSH = r / 2 + fsGDiff;
    }

    setQuotes() {
        let rand = Math.random();
        let fav = 1;
        if (rand > (0.5 + hostDiff))
            fav = 2;

        let min = getRandomArbitrary(minQuoteRange[0], minQuoteRange[1]);
        let x;
        let q2;
        let triplus = getQuoteFromPercentChance(getGoalsChanceFromExpectedGoals(3, goalsMaxCap - 1, 0, goalsMaxCap, this.expG));

        if (min < 1.85) {
            x = getSecondHighestQuote(min);
            q2 = getLastQuote(min, x);
        } else if (min >= 1.85 && min < 2.15) {
            if (triplus <= 1.6) {
                q2 = getSecondHighestQuote(min);
                x = getLastQuote(min, q2);
            } else {
                x = getSecondHighestQuote(min);
                q2 = getLastQuote(min, x);
            }
        } else {
            if (triplus <= 2.0) {
                q2 = getSecondHighestQuote(min);
                x = getLastQuote(min, q2);
            } else {
                x = getSecondHighestQuote(min);
                q2 = getLastQuote(min, x);
            }
        }
        if (fav == 1) {
            this.q1 = min;
            this.qX = x;
            this.q2 = q2;
        }
        else {
            this.q2 = min;
            this.qX = x;
            this.q1 = q2;
        }
        this.triplus = triplus;
        this.twoplus = getQuoteFromPercentChance(getGoalsChanceFromExpectedGoals(2, goalsMaxCap - 1, 0, goalsMaxCap, this.expG));
        this.zerotwo = getQuoteFromPercentChance(getGoalsChanceFromExpectedGoals(0, 2, 0, goalsMaxCap, this.expG));

        // this.gg missing? not really it's in setPredictions() ...
    }

    setResults() {
        let chQ1 = getPercentChanceFromQuote(this.q1);
        let chQX = getPercentChanceFromQuote(this.qX) + chQ1;
        let res;
        let r1 = Math.floor(Math.random() * 100);
        if (r1 < chQ1)
            res = 1;
        else if (r1 > chQ1 && r1 < chQX)
            res = 3;
        else
            res = 2;

        let goals;
        let r2 = Math.floor(Math.random() * 100);
        if (r2 < 20)
            goals = 2;
        else if (r2 >= 20 && r2 < 40)
            goals = 3;
        else if (r2 >= 40 && r2 < 55)
            goals = 1;
        else if (r2 >= 55 && r2 < 70)
            goals = 0;
        else if (r2 >= 70 && r2 < 85)
            goals = 4;
        else if (r2 >= 85 && r2 < 95)
            goals = 5;
        else
            goals = 6;

        if (res != 3 && goals % 2 == 0) {
            let r = Math.random();
            if (r > 0.5)
                goals--;
            else
                goals++;
            if (goals < 0)
                goals = 1;
        }
        if (res == 3 && goals % 2 != 0) {
            let r = Math.random();
            if (r > 0.5)
                goals--;
            else
                goals++;
        }

        let t1 = 0;
        let t2 = 0;
        if (res == 3) {
            let temp = goals / 2;
            if (temp < 1)
                temp = 0;
            t1 = temp;
            t2 = temp;
        }
        else {
            let temp = goals / 2;
            if (temp < 1)
                temp = 1;
            temp = Math.floor(temp);
            t1 = temp;
            let rem = goals - temp;
            for (let i = 0; i < rem; i++) {
                let r = Math.random();
                if (r > 0.5)
                    t1++;
                else
                    t2++;
            }
            if (res == 2) {
                let t = t2;
                t2 = t1;
                t1 = t;
            }
        }
        this.result[0] = t1;
        this.result[1] = t2;
    }

    setPredictions() {
        for (let i = 0; i < results.length; i++) {
            let p = new Prediction();
            p.Name = results[i];
            switch (results[i]) {
                case 'N':
                    p.Quote = 1;
                    p.Result = true;
                    break;
                case '1':
                    p.Quote = this.q1;
                    if (this.result[0] > this.result[1])
                        p.Result = true;
                    else
                        p.Result = false;
                    break;
                case 'X':
                    p.Quote = this.qX;
                    if (this.result[0] == this.result[1])
                        p.Result = true;
                    else
                        p.Result = false;
                    break;
                case '2':
                    p.Quote = this.q2;
                    if (this.result[0] < this.result[1])
                        p.Result = true;
                    else
                        p.Result = false;
                    break;
                case '2+':
                    p.Quote = this.twoplus;
                    if (this.result[0] + this.result[1] >= 2)
                        p.Result = true;
                    else
                        p.Result = false;
                    break;
                case '3+':
                    p.Quote = this.triplus;
                    if (this.result[0] + this.result[1] >= 3)
                        p.Result = true;
                    else
                        p.Result = false;
                    break;
                case '0-2':
                    p.Quote = this.zerotwo;
                    if (this.result[0] + this.result[1] <= 2)
                        p.Result = true;
                    else
                        p.Result = false;
                    break;
                case 'GG':
                    p.Quote = (this.twoplus + this.triplus) / 2 + 0.3; // ???
                    if (this.result[0] > 0 && this.result[1] > 0)
                        p.Result = true;
                    else
                        p.Result = false;
                    break;
            }
            this.predictions.push(p);
        }
    }
}

const getRandomArbitrary = (min, max) => {
    return Math.random() * (max - min) + min;
}

const getSecondHighestQuote = (min) => {
    let p = 100 / min;
    let chance = p / 100 * (100 - p) - quoteGeneratorOffset;
    return getQuoteFromPercentChance(chance);
}

const getLastQuote = (q1, q2) => {
    let c1 = getPercentChanceFromQuote(q1);
    let c2 = getPercentChanceFromQuote(q2);
    let c3 = 100 - (c1 + c2);
    return getQuoteFromPercentChance(c3);
}

const getQuoteFromPercentChance = (chance) => {
    return 100 / (chance / maxbetMagicNumber);
}

const getPercentChanceFromQuote = (quote) => {
    return (100 / quote) * maxbetMagicNumber;
}

const Fx = (x, n) => {
    return 7 * x - (Math.abs(x - n) * (x - n) / 2);
}

const FxAtoB = (a, b, n) => {
    return Fx(b, n) - Fx(a, n);
}

const getGoalsChanceFromExpectedGoals = (a, b, min, max, expected) => {
    return FxAtoB(a, b, expected) * 100 / FxAtoB(min, max, expected);
}