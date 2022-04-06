import AI from "../../../Wolfie2D/DataTypes/Interfaces/AI";
import Vec2 from "../../../Wolfie2D/DataTypes/Vec2";
import Debug from "../../../Wolfie2D/Debug/Debug";
import Emitter from "../../../Wolfie2D/Events/Emitter";
import GameEvent from "../../../Wolfie2D/Events/GameEvent";
import Receiver from "../../../Wolfie2D/Events/Receiver";
import Input from "../../../Wolfie2D/Input/Input";
import AnimatedSprite from "../../../Wolfie2D/Nodes/Sprites/AnimatedSprite";
import StateMachineAI from "../../../Wolfie2D/AI/StateMachineAI";
import OrthogonalTilemap from "../../../Wolfie2D/Nodes/Tilemaps/OrthogonalTilemap";
import MathUtils from "../../../Wolfie2D/Utils/MathUtils";

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
	protected tilemap: OrthogonalTilemap;

	initializeAI(owner: AnimatedSprite, options: Record<string, any>): void {
		this.owner = owner;

		let idle = new Idle(this, this.owner);
        this.addState(PlayerStates.IDLE, idle);
		let moving = new Moving(this, this.owner);
		this.addState(PlayerStates.MOVING, moving);

        this.initialize(PlayerStates.IDLE);
	}

	activate(options: Record<string, any>): void {};

	handleEvent(event: GameEvent): void {};

	update(deltaT: number): void {

		// Updating the state machine will trigger the current state to be updated.
		super.update(deltaT);

		while(this.receiver.hasNextEvent()){
			this.handleEvent(this.receiver.getNextEvent());
		}

	}

	destroy(): void {}
} 