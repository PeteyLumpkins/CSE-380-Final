import AI from "../../../Wolfie2D/DataTypes/Interfaces/AI";
import Vec2 from "../../../Wolfie2D/DataTypes/Vec2";
import Debug from "../../../Wolfie2D/Debug/Debug";
import Emitter from "../../../Wolfie2D/Events/Emitter";
import GameEvent from "../../../Wolfie2D/Events/GameEvent";
import Receiver from "../../../Wolfie2D/Events/Receiver";
import Input from "../../../Wolfie2D/Input/Input";
import AnimatedSprite from "../../../Wolfie2D/Nodes/Sprites/AnimatedSprite";
import StateMachineAI from "../../../Wolfie2D/AI/StateMachineAI";
import MathUtils from "../../../Wolfie2D/Utils/MathUtils";
import { Homework3Animations, Homework3Event } from "../../HW3_Enums";

import Idle from "./PlayerStates/Idle";
import Moving from "./PlayerStates/Moving";


export enum PlayerStates {
	IDLE = "IDLE_PLAYER_STATE", 
	MOVING = "MOVING_PLAYER_STATE"
}

export enum PlayerActions {
	ATTACKED = "ATTACKED_PLAYER_ACTION"
}

export default class PlayerController extends StateMachineAI {
	// We want to be able to control our owner, so keep track of them
	protected owner: AnimatedSprite;

	initializeAI(owner: AnimatedSprite, options: Record<string, any>): void {
		this.owner = owner;

		let idle = new Idle(this, this.owner);
        this.addState(PlayerStates.IDLE, idle);
		let moving = new Moving(this, this.owner);
		this.addState(PlayerStates.MOVING, moving);

        this.initialize(PlayerStates.IDLE);
	}

	activate(options: Record<string, any>){};

	handleEvent(event: GameEvent): void {
		// We need to handle animations when we get hurt
		// if(event.type === Homework3Event.PLAYER_DAMAGE){
		// 	if(event.data.get("health") === 0){
		// 		// Play animation and queue event to end game
		// 		this.emitter.fireEvent(Homework3Event.PLAYER_DEAD);
		// 		this.owner.animation.play("dying", false, Homework3Event.PLAYER_DEAD);
		// 		this.owner.animation.queue("dead", true);
		// 	} else {
		// 		this.owner.animation.play("damage", false, Homework3Event.PLAYER_I_FRAMES_END);
		// 	}
		// }
	}

	update(deltaT: number): void {

		// Updating the state machine will trigger the current state to be updated.
		super.update(deltaT);

		while(this.receiver.hasNextEvent()){
			this.handleEvent(this.receiver.getNextEvent());
		}

		if (this.currentState instanceof Idle){
			console.log("Idling");
		} else if (this.currentState instanceof Moving){
            console.log("Moving");
        }

		// We need to handle player input for movement
		// let forwardAxis = (Input.isPressed('forward') ? 1 : 0) + (Input.isPressed('backward') ? -1 : 0);
		// let horizontalAxis = (Input.isPressed('left') ? -1 : 0) + (Input.isPressed('right') ? 1 : 0);

		// let movement = Vec2.UP.scaled(forwardAxis * this.speed);
		// movement = movement.add(new Vec2(horizontalAxis * this.speed, 0));
		
		// // Move the player
		// this.owner.position.add(movement.scaled(deltaT));

		// // Animations
		// if(!this.owner.animation.isPlaying("damage") && !this.owner.animation.isPlaying("dying") && !this.owner.animation.isPlaying("firing")){
		// 	this.owner.animation.playIfNotAlready("driving");
		// }
	}

	destroy(): void {}
} 