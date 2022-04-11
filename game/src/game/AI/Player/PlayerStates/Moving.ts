
import State from "../../../../Wolfie2D/DataTypes/State/State";
import StateMachineAI from "../../../../Wolfie2D/AI/StateMachineAI";
import StateMachine from "../../../../Wolfie2D/DataTypes/State/StateMachine";
import GameNode from "../../../../Wolfie2D/Nodes/GameNode";
import GameEvent from "../../../../Wolfie2D/Events/GameEvent";
import Input from "../../../../Wolfie2D/Input/Input";
import Timer from "../../../../Wolfie2D/Timing/Timer";
import Vec2 from "../../../../Wolfie2D/DataTypes/Vec2";
import { PlayerStates } from "../PlayerController";
import PlayerState from "./PlayerState";




export default class Moving extends PlayerState {

    // This will be our players speed scale

    /**
     * TODO: When we start the moving animation we should play the sprites "move/run" animation
     */
    onEnter(options: Record<string, any>): void {
		this.owner.animation.play("WALK_DOWN");
	}

  update(deltaT: number): void {
		super.update(deltaT);

		let dir = this.getInputDirection();

		if(dir.isZero()){
			this.finished(PlayerStates.IDLE);
		} else {
            // TODO: the movement should be affected by the players default speed and speedScale
        // x component: -1 for left 1 for right
        if(dir.x == 1){
          console.log("1moving right");
          this.emitter.fireEvent(PlayerStates.MOVING_RIGHT, {position: this.owner.position});

        }else if (dir.x == -1){ // Moving left
          console.log("2moving left");

            this.emitter.fireEvent(PlayerStates.MOVING_LEFT, {position: this.owner.position});

        }
        else{
          if(dir.y == 1){ // Moving down
            console.log("3moving down");
            this.emitter.fireEvent(PlayerStates.MOVING, {position: this.owner.position});

          }
          if(dir.y == -1){
            console.log("4moving up");
            this.emitter.fireEvent(PlayerStates.MOVING, {position: this.owner.position});


          }
          

        }
            this.owner.move(dir.mult(new Vec2(this.speedScale, this.speedScale)));
        }
		
	}

  onExit(): Record<string, any> {
    return {};
  }
}