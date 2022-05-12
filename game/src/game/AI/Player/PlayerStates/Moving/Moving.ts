import Vec2 from "../../../../../Wolfie2D/DataTypes/Vec2";
import PlayerState from "../PlayerState";


export default abstract class Moving extends PlayerState {

    onEnter(options: Record<string, any>): void {
        this.owner.animation.playIfNotAlready(this.animation);

        /** Logic, is if we've entered the move state, it's because dir wasn't equal to zero */
        let dir = this.parent.getInputDirection();
        let speedScale = this.parent.playerStats.getStat(PlayerStat.MOVE_SPEED) !== null ? this.parent.playerStats.getStat(PlayerStat.MOVE_SPEED) : 1;
		this.owner.move(dir.mult(new Vec2(speedScale, speedScale))); 

        this.emitter.fireEvent(GameEventType.PLAY_SOUND, {key: "footstep", loop: false, holdReference: true});
    }

    handleInput(event: GameEvent): void {
        switch(event.type) {
            default: {
                super.handleInput(event);
                break;
            }
        }
    }

    update(deltaT: number): void {
        let dir = this.parent.getInputDirection();
        let attacking = this.parent.getAttacking();

        if (attacking) {
            this.attack();
        } else if(dir.isZero()){
            this.idle()
        } else {
            this.move(dir);
        }
    }

    onExit(): Record<string, any> { 
        return;
    }

    move(dir: Vec2): void {
        if (dir.x < 0) {
            this.finished(PlayerStates.MOVING_LEFT);
        } else if (dir.x > 0) {
            this.finished(PlayerStates.MOVING_RIGHT);
        } else if (dir.y < 0) {
            this.finished(PlayerStates.MOVING_UP);
        } else if (dir.y > 0) {
            this.finished(PlayerStates.MOVING_DOWN);
        }
    }

    abstract idle(): void;

    abstract attack(): void;
}

import MovingLeft from "./MovingLeft";
import MovingRight from "./MovingRight";
import MovingDown from "./MovingDown";
import MovingUp from "./MovingUp";
import { PlayerStat } from "../../PlayerStats";
import { GameEventType } from "../../../../../Wolfie2D/Events/GameEventType";
import { PlayerStates } from "../../PlayerController";
import GameEvent from "../../../../../Wolfie2D/Events/GameEvent";

export { MovingLeft, MovingRight, MovingDown, MovingUp }