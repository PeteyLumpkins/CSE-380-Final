
import State from "../../../../Wolfie2D/DataTypes/State/State";
import StateMachineAI from "../../../../Wolfie2D/AI/StateMachineAI";
import StateMachine from "../../../../Wolfie2D/DataTypes/State/StateMachine";
import GameNode from "../../../../Wolfie2D/Nodes/GameNode";
import GameEvent from "../../../../Wolfie2D/Events/GameEvent";
import Input from "../../../../Wolfie2D/Input/Input";
import Timer from "../../../../Wolfie2D/Timing/Timer";
import Vec2 from "../../../../Wolfie2D/DataTypes/Vec2";

import PlayerState from "./PlayerState";
import { PlayerStates, PlayerActions } from "../PlayerController";



export default class Moving extends PlayerState {

    // This will be our players speed scale

    /**
     * TODO: When we start the moving animation we should play the sprites "move/run" animation
     */
    onEnter(options: Record<string, any>): void {
		this.owner.animation.play("driving");
	}

    update(deltaT: number): void {
		super.update(deltaT);

		let dir = this.getInputDirection();

		if(dir.isZero()){
			this.finished(PlayerStates.IDLE);
		} else {
            // TODO: the movement should be affected by the players default speed and speedScale
            this.owner.position.add(dir);
            this.emitter.fireEvent(PlayerStates.MOVING, {position: this.owner.position})
        }
		
	}

    onExit(): Record<string, any> {
		return {};
	}
}