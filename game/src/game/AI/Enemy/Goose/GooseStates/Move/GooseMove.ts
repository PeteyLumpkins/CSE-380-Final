import GameEvent from "../../../../../../Wolfie2D/Events/GameEvent";
import Vec2 from "../../../../../../Wolfie2D/DataTypes/Vec2";

import GooseState from "../GooseState"

import { GooseAIStates } from "../../GooseAI";

export default abstract class GooseMove extends GooseState {

    update(deltaT: number): void {
        super.update(deltaT);

        let dir = this.owner.position.dirTo(this.parent.target.position);

        if (!this.inSightRange(this.parent.target.position)) {
            console.log("Out of visible range - idling")
            this.finished(GooseAIStates.IDLE_DEMON);

        } else if (!this.inAttackRange(this.parent.target.position)) {
            console.log("Trying to move into attack range of target");
            this.move(dir)
            this.parent.moveAction.performAction(deltaT, {
                "target": this.owner,
                "position": this.parent.target.position
            }, ()=>{});

        } else {
            this.attack(dir);
        }
    }

    handleInput(event: GameEvent): void {}
     
    abstract move(dir: Vec2): void;

    abstract attack(dir: Vec2): void;
}

import GooseMoveLeft from "./GooseMoveLeft";
import GooseMoveRight from "./GooseMoveRight";

export { GooseMoveLeft, GooseMoveRight }
