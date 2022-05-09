import GameEvent from "../../../../../Wolfie2D/Events/GameEvent";

import TurtleState from "./TurtleState";
import { TurtleAIStates } from "../TurtleAI";

export default class TurtleMove extends TurtleState {

    
    onEnter(options: Record<string, any>): void {
        console.log("Entering the Turtle move state");
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
            this.finished(TurtleAIStates.ATTACK);
        }
    }

    handleInput(event: GameEvent): void {}

    onExit(): Record<string, any> { return; }

}