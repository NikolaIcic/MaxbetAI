const fsGDiff = 0.07;
const hostDiff = 0.02;
const quoteGeneratorOffset = 3;
const maxbetMagicNumber = 0.95;

export default class RandomGame{
    constructor(){
        this.expG = 2.5;
        this.expGFH = 1.2;
        this.expGSH = 1.35
        this.q1 = 1;
        this.qX = 1;
        this.q2 = 1;
        this.setExpectedGoals();
    }

    setExpectedGoals(){
        let rand = Math.floor(Math.random() * 10);
        let r = 1;
        if(rand < 2)
            r = getRandomArbitrary(0,0.5);    
        else if(rand >= 2 && rand < 5)
            r = getRandomArbitrary(0.6,1.4);
           
        else if(rand >= 5 && rand < 9)
            r = getRandomArbitrary(1.5,3.4);
        else
            r = getRandomArbitrary(3.5,4.2);
        this.setExpGoalsFromRandom(r);
    }

    setExpGoalsFromRandom(r){
        this.expG = r;
        this.expGFH = r / 2 - fsGDiff;
        if(this.expGFH < 0)
            this.expGFH = 0;
        this.expGSH = r / 2 + fsGDiff;
    }

    setQuotes(){
        let rand = Math.random();
        let fav = 1;
        if(rand > (0.5 + hostDiff))
            fav = 2;

        let min = 2;
        let x;
        let q2;
        if(min < 1.85){
            x = getSecondHighestQuote(min);
            q2 = getLastQuote(min,x);
        }else if(min >= 1.85 && min < 2.15){
            
        }else{

        }

    }
}

const getRandomArbitrary = (min, max) => {
    return Math.random() * (max - min) + min;
}

const getSecondHighestQuote = (min) => {
    let p = 100 / min;
    let chance = p * (100 - p) - quoteGeneratorOffset;
    return  getQuoteFromPercentChance(chance);
}

const getLastQuote = (q1,q2) => {
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