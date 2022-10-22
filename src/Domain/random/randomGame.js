const fsGDiff = 0.07;
const hostDiff = 0.02;
const quoteGeneratorOffset = 3;
const maxbetMagicNumber = 0.95;
const goalsMaxCap = 7;
const minQuoteRange = [1.15,2.8];

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
        this.setExpectedGoals();
        this.setQuotes();
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

        let min = getRandomArbitrary(minQuoteRange[0],minQuoteRange[1]);
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
            this.x = x;
            this.q2 = q2;
        }
        else {
            this.q2 = min;
            this.x = x;
            this.q1 = q2;
        }
        this.triplus = triplus;
        this.twoplus = getQuoteFromPercentChance(getGoalsChanceFromExpectedGoals(2, goalsMaxCap - 1, 0, goalsMaxCap, this.expG));
        this.zerotwo = getQuoteFromPercentChance(getGoalsChanceFromExpectedGoals(0, 2, 0, goalsMaxCap, this.expG));
    }
}

const getRandomArbitrary = (min, max) => {
    return Math.random() * (max - min) + min;
}

const getSecondHighestQuote = (min) => {
    let p = 100 / min;
    let chance = p * (100 - p) - quoteGeneratorOffset;
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
    return FxAtoB(a, b, expected) / FxAtoB(min, max, expected);
}