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
    protected owner: AnimatedSprite;

	protected attackTimer: Timer;
	protected attackType: string;

	constructor(parent: StateMachine, owner: AnimatedSprite){
		super(parent);
		this.owner = owner;

		this.attackTimer = new Timer(880/2, () => {
			console.log("Player attack timer ended");
			this.sendPlayerAttacked(this.owner.position);
		});
	}

    handleInput(event: GameEvent): void {
		
	}

	// Gets called after the player has finished attacking
	sendPlayerAttacked(position: Vec2) {
		let damage = this.parent.playerStats.getStat(PlayerStat.ATTACK_DMG) !== null ? this.parent.playerStats.getStat(PlayerStat.ATTACK_DMG) : 1;

		if (this.parent.instakill) { damage = Infinity; }

		let dir = Vec2.ZERO;
		let hitbox = null;
		switch(this.attackType) {
			case PlayerStates.PUNCH_DOWN: {
				hitbox = this.parent.getDownHitbox();
				dir.y = -1;
				break;
			}
			case PlayerStates.PUNCH_LEFT: {
				hitbox = this.parent.getLeftHitbox();
				dir.x = -1;
				break;
			}
			case PlayerStates.PUNCH_RIGHT: {
				hitbox = this.parent.getRightHitbox();
				dir.x = 1;
				break;
			}
			case PlayerStates.PUNCH_UP: {
				hitbox = this.parent.getUpHitbox();
				dir.y = 1;
				break;
			}
			default: {
				console.log("Unknown attack type while sending attack?");
				break;
			}
		}
		this.emitter.fireEvent(PlayerEvents.ATTACKED, {position: position, dir: dir, hitbox: hitbox, damage: damage});
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
		return Input.isPressed("attack");
	}

    /** 
     * Regardless of the players state (attacking or moving), they should be able to move
     */
	update(deltaT: number): void {
		let speedScale = this.parent.playerStats.getStat(PlayerStat.MOVE_SPEED) !== null ? this.parent.playerStats.getStat(PlayerStat.MOVE_SPEED) : 1;
		let dir = this.getInputDirection()
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