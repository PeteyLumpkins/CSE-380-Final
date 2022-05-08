import GameEvent from "../../../../../../Wolfie2D/Events/GameEvent";
import Vec2 from "../../../../../../Wolfie2D/DataTypes/Vec2";

import GooseState from "../GooseState";
import { GooseAIStates } from "../../GooseAI"

export default abstract class GooseIdle extends GooseState {

    /** Defines whether or not this goose can move or not - @implement */
    abstract canMove(): boolean;

    update(deltaT: number): void {
        super.update(deltaT);

        if (this.canMove()) {
            
            let dir = this.owner.position.dirTo(this.parent.target.position);
            this.move(dir);
        }
    }

    move(dir: Vec2): void {
        if (dir.x > 0) {
            this.finished(GooseAIStates.MOVE_RIGHT);
        } else if (dir.x < 0) {
            this.finished(GooseAIStates.MOVE_LEFT);
        }
    }

    handleInput(event: GameEvent): void {}

    onExit(): Record<string, any> { return; }

}