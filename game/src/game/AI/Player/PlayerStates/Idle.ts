import State from "../../../../Wolfie2D/DataTypes/State/State";
import StateMachineAI from "../../../../Wolfie2D/AI/StateMachineAI";
import StateMachine from "../../../../Wolfie2D/DataTypes/State/StateMachine";
import GameNode from "../../../../Wolfie2D/Nodes/GameNode";
import GameEvent from "../../../../Wolfie2D/Events/GameEvent";
import Input from "../../../../Wolfie2D/Input/Input";
import Timer from "../../../../Wolfie2D/Timing/Timer";
import Vec2 from "../../../../Wolfie2D/DataTypes/Vec2";

import PlayerState from "./PlayerState";
import { PlayerStates } from "../PlayerController";


export default class Idle extends PlayerState {

    /**
     * TODO: Start playing our characters idling animation
     */
    onEnter(options: Record<string, any>): void {
		this.owner.animation.play("IDLE");
	}

    update(deltaT: number): void {
		super.update(deltaT);

		let dir = this.getInputDirection();
		if(!dir.isZero()){
			this.finished(PlayerStates.MOVING);
		}
		
	}

    onExit(): Record<string, any> {
		// this.owner.animation.stop();
		return {};
	}
}