import Agent from "./Agent";

export default class Evolution{
    constructor(){
        this.Agents = [];
    }

    createAgents(count){
        for(let i=0;i<count;i++)
            this.Agents.push(new Agent());
    }

    agentPredictResult(){
        this.Agents.forEach(agent => {
            agent.getPrediction();
        });
    }
}