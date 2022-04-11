import State from "../../../../Wolfie2D/DataTypes/State/State";
import StateMachineAI from "../../../../Wolfie2D/AI/StateMachineAI";
import StateMachine from "../../../../Wolfie2D/DataTypes/State/StateMachine";
import AnimatedSprite from "../../../../Wolfie2D/Nodes/Sprites/AnimatedSprite";
import GameEvent from "../../../../Wolfie2D/Events/GameEvent";
import Input from "../../../../Wolfie2D/Input/Input";
import Timer from "../../../../Wolfie2D/Timing/Timer";
import Vec2 from "../../../../Wolfie2D/DataTypes/Vec2";

import PlayerController from "../PlayerController";
import { EnemyActions } from "../../../GameEnums";
import { PlayerEvents } from "../../Player/PlayerController";

export default abstract class PlayerState extends State {

	parent: PlayerController;

    protected owner: AnimatedSprite;


    protected attackTimer: Timer;

	// These values will scale the players stats
    protected speedScale: number = 2;
    protected healthScale: number = 1;
    protected attackScale: number = 1;

	constructor(parent: StateMachine, owner: AnimatedSprite){
		super(parent);
		this.owner = owner;

		// I think timer takes what milliseconds right?
		this.attackTimer = new Timer(10000, () => {
			console.log("Player attack timer ended");
			this.sendPlayerAttacked(this.owner.position);
		});
	}

    handleInput(event: GameEvent): void {
		console.log("Player state event caught: " + event.type);
		switch(event.type) {

			case EnemyActions.ATTACK: {
				console.log("Enemy attack action caught in player state!");
				break;
			}

			default: {
				console.log("Unchecked action caught in player state");
				break;
			}
		}
	}

	// Gets called after the player has finished attacking
	sendPlayerAttacked(position: Vec2) {
		this.emitter.fireEvent(PlayerEvents.ATTACKED, {position: position});
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

	attack(): void {
		if (this.attackTimer.isStopped()) {
			console.log("Starting the attack timer");
			this.attackTimer.start();
		}
	}

    /** 
     * TODO: Updates the state of the player regardless of players state
     * 
     *  Should handle the players invincible timer here I'm pretty sure
     *  Should handle the player taking damage also
     */
	update(deltaT: number): void {

		// This handles the attack action for now
		if (Input.isPressed("attack")) {
			this.attack();
		}
	}

}