import GameEvent from "../../../../../../Wolfie2D/Events/GameEvent";
import Vec2 from "../../../../../../Wolfie2D/DataTypes/Vec2";

import GooseState from "../GooseState"

import { GooseAIStates } from "../../GooseAI";

export default abstract class GooseMove extends GooseState {

    update(deltaT: number): void {
        super.update(deltaT);

        let dir = this.owner.position.dirTo(this.parent.target.position);

        if (!this.inSightRange(this.parent.target.position)) {
            this.idle();
        }

        /** If we're not in range of target - move toward target */
        if (!this.inAttackRange(this.parent.target.position)) {
            this.move(dir)
            this.parent.moveAction.performAction(deltaT, {
                "target": this.owner,
                "position": this.parent.target.position
            }, ()=>{});
        } 

        /** Otherwise - transition to attacking state */
        this.attack(dir);
    }

    handleInput(event: GameEvent): void {}

    abstract idle(): void;
     
    abstract move(dir: Vec2): void;

    abstract attack(dir: Vec2): void;
}