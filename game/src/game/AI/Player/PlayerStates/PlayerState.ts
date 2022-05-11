import State from "../../../../Wolfie2D/DataTypes/State/State";
import StateMachine from "../../../../Wolfie2D/DataTypes/State/StateMachine";
import AnimatedSprite from "../../../../Wolfie2D/Nodes/Sprites/AnimatedSprite";
import GameEvent from "../../../../Wolfie2D/Events/GameEvent";
import Input from "../../../../Wolfie2D/Input/Input";
import Timer from "../../../../Wolfie2D/Timing/Timer";
import Vec2 from "../../../../Wolfie2D/DataTypes/Vec2";
import AABB from "../../../../Wolfie2D/DataTypes/Shapes/AABB";

import PlayerController from "../PlayerController";
import { PlayerEvents, PlayerStates } from "../../Player/PlayerController";
import { GameEventType } from "../../../../Wolfie2D/Events/GameEventType";
import { PlayerStat } from "../PlayerStats";

export default abstract class PlayerState extends State {

	parent: PlayerController;
    owner: AnimatedSprite;

	/** This represents the current animation being played */
	protected animation: string;

	constructor(parent: StateMachine, owner: AnimatedSprite){
		super(parent);
		this.owner = owner;
	}

    handleInput(event: GameEvent): void {
		
	}

	/** 
	 * Get the inputs from the keyboard, or Vec2.Zero if nothing is being pressed
	 */
	getInputDirection(): Vec2 {
		let direction = Vec2.ZERO;
		direction.x = (Input.isPressed("left") ? -1 : 0) + (Input.isPressed("right") ? 1 : 0);
		direction.y = (Input.isPressed("forward") ? -1 : 0) + (Input.isPressed("backward") ? 1: 0);
		return direction;
	}

	isAttacking(): boolean {
		return this.parent.numAttacks > 0;
	}

	getAttacking(): boolean {
		return Input.isJustPressed("attack");
	}

    /** 
     * Regardless of the players state (attacking or moving), they should be able to move
     */
	update(deltaT: number): void {
		let speedScale = this.parent.playerStats.getStat(PlayerStat.MOVE_SPEED) !== null ? this.parent.playerStats.getStat(PlayerStat.MOVE_SPEED) : 1;
		let dir = this.getInputDirection()

		/** If player attacked - increase num attacks by 1 */
		if (this.getAttacking()) {
			console.log("Incrementing player attacks in update!");
			this.parent.numAttacks += 1;
		}

		if (!dir.isZero) {
			this.emitter.fireEvent(GameEventType.PLAY_SOUND, {key: "footstep", loop: false, holdReference: true});
		}

		this.owner.move(dir.mult(new Vec2(speedScale, speedScale))); 
		
	}

}

import { IdleLeft, IdleRight, IdleDown, IdleUp } from "./Idle/Idle";
import { MovingLeft, MovingRight, MovingDown, MovingUp } from "./Moving/Moving";
import { PunchLeft, PunchRight, PunchDown, PunchUp } from "./Punch/Punch";

export {
	IdleLeft, IdleRight, IdleDown, IdleUp,
	MovingLeft, MovingRight, MovingDown, MovingUp,
	PunchLeft, PunchRight, PunchDown, PunchUp
}