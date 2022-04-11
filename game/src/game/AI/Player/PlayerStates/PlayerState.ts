import State from "../../../../Wolfie2D/DataTypes/State/State";
import StateMachineAI from "../../../../Wolfie2D/AI/StateMachineAI";
import StateMachine from "../../../../Wolfie2D/DataTypes/State/StateMachine";
import AnimatedSprite from "../../../../Wolfie2D/Nodes/Sprites/AnimatedSprite";
import GameEvent from "../../../../Wolfie2D/Events/GameEvent";
import Input from "../../../../Wolfie2D/Input/Input";
import Timer from "../../../../Wolfie2D/Timing/Timer";
import Vec2 from "../../../../Wolfie2D/DataTypes/Vec2";


import PlayerController from "../PlayerController";

export default abstract class PlayerState extends State {

	parent: PlayerController;

    protected owner: AnimatedSprite;
    protected invincibleTimer: Timer;

	// These values will scale the players stats
    protected speedScale: number = 2;
    protected healthScale: number = 1;
    protected attackScale: number = 1;

	constructor(parent: StateMachine, owner: AnimatedSprite){
		super(parent);
		this.owner = owner;
	}

    handleInput(event: GameEvent): void {}

	/** 
	 * Get the inputs from the keyboard, or Vec2.Zero if nothing is being pressed
	 */
	getInputDirection(): Vec2 {
		let direction = Vec2.ZERO;
		direction.x = (Input.isPressed("left") ? -1 : 0) + (Input.isPressed("right") ? 1 : 0);
		direction.y = (Input.isPressed("forward") ? -1 : 0) + (Input.isPressed("backward") ? 1: 0);
		return direction;
	}

    /** 
     * TODO: Updates the state of the player regardless of players state
     * 
     *  Should handle the players invincible timer here I'm pretty sure
     *  Should handle the player taking damage also
     */
	update(deltaT: number): void {
		
	}

}