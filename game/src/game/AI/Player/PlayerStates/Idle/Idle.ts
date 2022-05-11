import PlayerState from "../PlayerState";
import { PlayerStates } from "../../PlayerController";
import Vec2 from "../../../../../Wolfie2D/DataTypes/Vec2";


export default abstract class Idle extends PlayerState {

    onEnter(options: Record<string, any>): void {
        this.owner.animation.play(this.animation);
    }

    update(deltaT: number): void {
        super.update(deltaT);

        let dir = this.getInputDirection();

        if (this.isAttacking()) {
            console.log("Transitioning from Idle to Attack")
            this.attack();
        }

        if(!dir.isZero()){
            console.log("Transitioning from Idle to Move");
            this.move(dir);
        }
	  }

    onExit(): Record<string, any> {
      return {};
    }

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