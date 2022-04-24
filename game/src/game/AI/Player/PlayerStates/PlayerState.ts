import State from "../../../../Wolfie2D/DataTypes/State/State";
import StateMachine from "../../../../Wolfie2D/DataTypes/State/StateMachine";
import AnimatedSprite from "../../../../Wolfie2D/Nodes/Sprites/AnimatedSprite";
import GameEvent from "../../../../Wolfie2D/Events/GameEvent";
import Input from "../../../../Wolfie2D/Input/Input";
import Timer from "../../../../Wolfie2D/Timing/Timer";
import Vec2 from "../../../../Wolfie2D/DataTypes/Vec2";

import PlayerController from "../PlayerController";
import { PlayerEvents } from "../../Player/PlayerController";
import { PlayerStat } from "../../../Player/PlayerStats";

export default abstract class PlayerState extends State {

	parent: PlayerController;
    protected owner: AnimatedSprite;
    protected attackTimer: Timer;

	constructor(parent: StateMachine, owner: AnimatedSprite){
		super(parent);
		this.owner = owner;

		// I think timer takes what milliseconds right?
		this.attackTimer = new Timer(100, () => {
			console.log("Player attack timer ended");
			this.sendPlayerAttacked(this.owner.position);
		});
	}

    handleInput(event: GameEvent): void {
		
	}

	// Gets called after the player has finished attacking
	sendPlayerAttacked(position: Vec2) {
		let damage = this.parent.playerStats.getStat(PlayerStat.ATTACK_DMG) !== null ? this.parent.playerStats.getStat(PlayerStat.ATTACK_DMG) : 1;

		console.log("Sending attack with damage: " + damage);
		this.emitter.fireEvent(PlayerEvents.ATTACKED, {position: position, range: 75, damage: damage});
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
		return Input.isPressed("attack") || !this.attackTimer.isStopped();
	}

    /** 
     * Regardless of the players state (attacking or moving), they should be able to move
     */
	update(deltaT: number): void {
		let speedScale = this.parent.playerStats.getStat(PlayerStat.MOVE_SPEED) !== null ? this.parent.playerStats.getStat(PlayerStat.MOVE_SPEED) : 1;
		console.log("Moving with a speed scale of: " + speedScale);
		this.owner.move(this.getInputDirection().mult(new Vec2(speedScale, speedScale))); 
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