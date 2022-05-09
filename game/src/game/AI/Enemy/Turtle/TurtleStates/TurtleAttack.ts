import GameEvent from "../../../../../Wolfie2D/Events/GameEvent";

import TurtleState from "./TurtleState";
import { TurtleAIStates } from "../TurtleAI";

export default class RatAttack extends TurtleState {

    onEnter(options: Record<string, any>): void {
        console.log('Entering the turtle attack state');
    }

    update(deltaT: number): void {
        super.update(deltaT);

        // If we're out of range - go back to the move state
        if (!this.inAttackRange(this.parent.target.position)) {
            this.finished(TurtleAIStates.MOVE);
        }

        // If we're in range and the attack is ready - well then we attack
        if (this.attackReady()) {
            this.parent.attack.performAction(deltaT, {}, () => {this.parent.attackCooldownTimer.start()});
        }
    }

    handleInput(event: GameEvent): void {}

    onExit(): Record<string, any> { return; }

}