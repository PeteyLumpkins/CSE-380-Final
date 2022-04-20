import PlayerState from "../PlayerState";
import { PlayerStates } from "../../PlayerController";
import Vec2 from "../../../../../Wolfie2D/DataTypes/Vec2";


export default abstract class Idle extends PlayerState {

    update(deltaT: number): void {
        super.update(deltaT);

        let dir = this.getInputDirection();

        if (this.isAttacking()) {
          this.attack();
        }

        if(!dir.isZero()){
           this.move(dir);
        }
	  }

    move(dir: Vec2): void {
      if (dir.x > 0 && dir.y > 0) {
        // Up-right?
      } else if (dir.x > 0 && dir.y < 0) {
        // Down-right?
      } else if (dir.x < 0 && dir.y > 0) {
        // Up-left?
      } else if (dir.x < 0 && dir.y < 0) {
        // Down-left?
      } else if (dir.x < 0) {
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