import GameEvent from "../../../../../Wolfie2D/Events/GameEvent";

import RatState from "./RatState";
import { RatAIStates } from "../RatAI";

export default class RatMove extends RatState {

    
    onEnter(options: Record<string, any>): void {
        console.log("Entering the rat move state");
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
            this.finished(RatAIStates.ATTACK);
        }
    }

    handleInput(event: GameEvent): void {}

    onExit(): Record<string, any> { return; }

}