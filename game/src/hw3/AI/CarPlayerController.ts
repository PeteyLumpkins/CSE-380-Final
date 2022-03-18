import AI from "../../Wolfie2D/DataTypes/Interfaces/AI";
import Vec2 from "../../Wolfie2D/DataTypes/Vec2";
import Debug from "../../Wolfie2D/Debug/Debug";
import Emitter from "../../Wolfie2D/Events/Emitter";
import GameEvent from "../../Wolfie2D/Events/GameEvent";
import Receiver from "../../Wolfie2D/Events/Receiver";
import Input from "../../Wolfie2D/Input/Input";
import AnimatedSprite from "../../Wolfie2D/Nodes/Sprites/AnimatedSprite";
import MathUtils from "../../Wolfie2D/Utils/MathUtils";
import { Homework3Animations, AdamAnimations, Homework3Event } from "../HW3_Enums";

export default class CarPlayerController implements AI {
	// We want to be able to control our owner, so keep track of them
	private owner: AnimatedSprite;

	// The speed the car is moving
	private MIN_SPEED: number = 300;
	private MAX_SPEED: number = 500;
	private speed: number;

	private isDead: boolean = false;

	// A receiver and emitter to hook into the event queue
	private receiver: Receiver;
	private emitter: Emitter;

	// HOMEWORK 3 - TODO 
	/**
	 * This method initializes all variables inside of this AI class, and sets
	 * up anything we need it do.
	 * 
	 * You should subscribe to the correct event for player damage here using the Receiver.
	 * The AI will react to the event in handleEvent() - you just need to make sure
	 * it is subscribed to them.
	 * 
	 * Also note the names of animations when calling this.owner.animation.play, you do not need to implement these parts but
	 * note that you either need to adjust the names of the animations to what you have or rename the animations where appropriate.
	 * 
	 * @param owner The owner of this AI - i.e. the player
	 * @param options The list of options for ai initialization
	 */
	initializeAI(owner: AnimatedSprite, options: Record<string, any>): void {
		this.owner = owner;

		//Start with MIN_SPEED
		this.speed = this.MIN_SPEED;

		this.receiver = new Receiver();

		this.receiver.subscribe(Homework3Event.PLAYER_DAMAGE);

		this.emitter = new Emitter();
	}

	activate(options: Record<string, any>){};

	handleEvent(event: GameEvent): void {
		// We need to handle animations when we get hurt
		
	}

	update(deltaT: number): void {
		if(this.isDead) return;
		
		while(this.receiver.hasNextEvent()){
			this.handleEvent(this.receiver.getNextEvent());
		}


		// We need to handle player input for movement
		let forwardAxis = (Input.isPressed('forward') ? 1 : 0) + (Input.isPressed('backward') ? -1 : 0);
		let horizontalAxis = (Input.isPressed('left') ? -1 : 0) + (Input.isPressed('right') ? 1 : 0);

		let movement = Vec2.UP.scaled(forwardAxis * this.speed);
		movement = movement.add(new Vec2(horizontalAxis * this.speed, 0));
		
		// Move the player
		this.owner.position.add(movement.scaled(deltaT));

		// Animations
		if (Input.isPressed('forward')) { this.owner.animation.play(AdamAnimations.IDLE_UP); }
		else if (Input.isPressed('right')) { this.owner.animation.play(AdamAnimations.IDLE_RIGHT); }
		else if (Input.isPressed('left')) { this.owner.animation.play(AdamAnimations.IDLE_LEFT); }
		else if (Input.isPressed('backward')) { this.owner.animation.play(AdamAnimations.IDLE_DOWN); }

	}

	destroy(): void {
		
	}
} 