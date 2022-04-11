
import Vec2 from "../../../../Wolfie2D/DataTypes/Vec2";
import { PlayerStates } from "../PlayerController";
import PlayerState from "./PlayerState";




export default class Moving extends PlayerState {

    // This will be our players speed scale

    /**
     * TODO: When we start the moving animation we should play the sprites "move/run" animation
     */
    onEnter(options: Record<string, any>): void {
		this.owner.animation.play("WALK_RIGHT");
    console.log("in moving_right");
	}

  update(deltaT: number): void {
		super.update(deltaT);

		let dir = this.getInputDirection();

		if(dir.isZero()){
			this.finished(PlayerStates.IDLE_RIGHT);
		} else {
            // TODO: the movement should be affected by the players default speed and speedScale

            this.owner.move(dir.mult(new Vec2(this.speedScale, this.speedScale)));
            this.emitter.fireEvent(PlayerStates.MOVING_RIGHT, {position: this.owner.position})
        }
		
	}

  onExit(): Record<string, any> {
    return {};
  }
}