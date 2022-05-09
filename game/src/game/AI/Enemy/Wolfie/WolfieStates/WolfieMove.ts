import GameEvent from "../../../../../Wolfie2D/Events/GameEvent";
import { WolfieAIStates } from "../WolfieAI";


import WolfieState from "./WolfieState";

export default class WolfieMove extends WolfieState {

    
    onEnter(options: Record<string, any>): void {
        console.log("Entering the wolfie move state");
            this.owner.animation.play("move");
    }

    update(deltaT: number): void {
        super.update(deltaT);

        if (!this.inAttackRange(this.parent.target.position)) {

            // Perform a move action
            this.parent.move.performAction(deltaT, {
                "target": this.owner,
                "position": this.parent.target.position
            }, ()=>{});

        } else {

            // Transition to the attack state
            this.finished(WolfieAIStates.ATTACK);
        }
    }

    handleInput(event: GameEvent): void {}

    onExit(): Record<string, any> { return; }

}