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

import { GameEvents, EnemyActions } from "../../GameEnums";
import { PickupTypes } from "../Pickup/PickupTypes";


export enum PlayerStates {
	IDLE = "IDLE_PLAYER_STATE", 
	MOVING = "MOVING_PLAYER_STATE"
}

export enum PlayerEvents {
	ATTACKED = "PLAYER_EVENT_ATTACKED",
	HEALTH_CHANGE = "PLAYER_EVENT_HEALTH_CHANGE",
	MONEY_CHANGE = "PLAYER_EVENT_MONEY_CHANGE"
}

export default class PlayerController extends StateMachineAI {
	// We want to be able to control our owner, so keep track of them
	protected owner: AnimatedSprite;
	protected tilemap: OrthogonalTilemap;

	protected money: number = 0;

	initializeAI(owner: AnimatedSprite, options: Record<string, any>): void {
		this.owner = owner;

		let idle = new Idle(this, this.owner);
        this.addState(PlayerStates.IDLE, idle);
		let moving = new Moving(this, this.owner);
		this.addState(PlayerStates.MOVING, moving);

        this.initialize(PlayerStates.IDLE);

		this.receiver.subscribe(GameEvents.PICKUP_ITEM);
	}

	activate(options: Record<string, any>): void {};

	handleEvent(event: GameEvent): void {
		switch(event.type) {
			case GameEvents.PICKUP_ITEM: {
				console.log("Caught item pickup in player controller");
				this.handleItemPickupEvent(event);
				break;
			}
			case EnemyActions.ATTACK: {
				console.log("Caught enemy attack action in player controller");
				break;
			}
			default: {
				console.log("Caught unhandled event in event handler for player controller");
				break;
			}
		}
	};

	update(deltaT: number): void {

		// Updating the state machine will trigger the current state to be updated.
		super.update(deltaT);

		while(this.receiver.hasNextEvent()){
			this.handleEvent(this.receiver.getNextEvent());
		}

	}

	// All item pickup events should have a "type"
	handleItemPickupEvent(event: GameEvent): void {
		switch(event.data.get("type")) {

			case PickupTypes.MONEY: {
				this.money += event.data.get("amount");
				this.emitter.fireEvent(PlayerEvents.MONEY_CHANGE, {amount: this.money});
				break;
			}

			default: {
				console.log(`Unrecognized type on pickup event: ${event.data.get("type")}`);
				break;
			}
		}
	}

	// TODO: handles when an enemy trys to attack the player
	handleEnemyAttackEvent(event: GameEvent): void {

	}

	destroy(): void {}
} 