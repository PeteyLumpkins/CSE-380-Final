import Vec2 from "../../../../../Wolfie2D/DataTypes/Vec2";
import GameEvent from "../../../../../Wolfie2D/Events/GameEvent";
import PlayerState from "../PlayerState";
import { PlayerStates } from "../../PlayerController";

export default abstract class Idle extends PlayerState {

    onEnter(options: Record<string, any>): void {
        this.owner.animation.playIfNotAlready(this.animation);
    }

    handleInput(event: GameEvent) {
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
            console.log("Transitioning from Idle to Attack")
            this.attack();
        }

        if(!dir.isZero()){
            console.log("Transitioning from Idle to Move");
            this.move(dir);
        }
	  }

    onExit(): Record<string, any> { return; }

    move(dir: Vec2): void {
      if (dir.x < 0) {
        this.finished(PlayerStates.MOVING_LEFT);
      } else if (dir.y < 0) {
        this.finished(PlayerStates.MOVING_DOWN);
      } else if (dir.x > 0) {
        this.finished(PlayerStates.MOVING_RIGHT);
      } else if (dir.y > 0) {
        this.finished(PlayerStates.MOVING_UP);
      }
    }

    abstract attack(): void;
}

import IdleLeft from "./IdleLeft";
import IdleRight from "./IdleRight";
import IdleDown from "./IdleDown";
import IdleUp from "./IdleUp";

export { IdleLeft, IdleRight, IdleDown, IdleUp } 