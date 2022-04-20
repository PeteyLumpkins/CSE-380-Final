import GameEvent from "../../../Wolfie2D/Events/GameEvent";
import AnimatedSprite from "../../../Wolfie2D/Nodes/Sprites/AnimatedSprite";
import StateMachineAI from "../../../Wolfie2D/AI/StateMachineAI";
import OrthogonalTilemap from "../../../Wolfie2D/Nodes/Tilemaps/OrthogonalTilemap";

import {

	IdleLeft, IdleRight, IdleDown, IdleUp,
	MovingLeft, MovingRight, MovingDown, MovingUp,
	PunchLeft, PunchRight, PunchDown, PunchUp

} from "./PlayerStates/PlayerState";

import { GameEvents, EnemyActions } from "../../GameEnums";
import {PickupTypes} from "../Pickup/PickupTypes";

export enum PlayerStates {
	IDLE_RIGHT = "IDLE_RIGHT_PLAYER_STATE",
	IDLE_LEFT = "IDLE_LEFT_PLAYER_STATE",
	IDLE_DOWN = "IDLE_DOWN_PLAYER_STATE",
	IDLE_UP = "IDLE_UP_PLAYER_STATE",
	
	MOVING_RIGHT = "MOVING_RIGHT_PLAYER_STATE",
	MOVING_LEFT = "MOVING_LEFT_PLAYER_STATE",
	MOVING_DOWN = "MOVING_DOWN_PLAYER_STATE",
	MOVING_UP = "MOVING_UP_PLAYER_STATE",

	PUNCH_RIGHT = "PUNCH_RIGHT_PLAYER_STATE",
	PUNCH_LEFT = "PUNCH_LEFT_PLAYER_STATE",
	PUNCH_UP = "PUNCH_UP_PLAYER_STATE",
	PUNCH_DOWN = "PUNCH_DOWN_PLAYER_STATE"
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

	protected maxHealth: number;

	protected health: number;
	protected money: number;
	protected inventory: Array<Record<string, any>>;

	initializeAI(owner: AnimatedSprite, options: Record<string, any>): void {
		this.owner = owner;

		this.maxHealth = 20;
		this.health = 20;
		this.money = 0;
		this.inventory = new Array<Record<string, any>>();

        this.addState(PlayerStates.IDLE_LEFT, new IdleLeft(this, this.owner));
		this.addState(PlayerStates.IDLE_RIGHT, new IdleRight(this, this.owner));
		this.addState(PlayerStates.IDLE_DOWN, new IdleDown(this, this.owner));
		this.addState(PlayerStates.IDLE_UP, new IdleUp(this, this.owner));

		this.addState(PlayerStates.MOVING_LEFT, new MovingLeft(this, this.owner));
		this.addState(PlayerStates.MOVING_RIGHT, new MovingRight(this, this.owner));
		this.addState(PlayerStates.MOVING_DOWN, new MovingDown(this, this.owner));
		this.addState(PlayerStates.MOVING_UP, new MovingUp(this, this.owner));

		this.addState(PlayerStates.PUNCH_LEFT, new PunchLeft(this, this.owner));
		this.addState(PlayerStates.PUNCH_RIGHT, new PunchRight(this, this.owner));
		this.addState(PlayerStates.PUNCH_DOWN, new PunchDown(this, this.owner));
		this.addState(PlayerStates.PUNCH_UP, new PunchUp(this, this.owner));
		
        this.initialize(PlayerStates.IDLE_RIGHT);

		this.receiver.subscribe(GameEvents.PICKUP_ITEM);
		this.receiver.subscribe(EnemyActions.ATTACK);
	}

	getPlayerMoney(): number { 
		return this.money;
	}

	getPlayerInventory(): Array<Record<string,any>> {
		return this.inventory;
	}

	activate(options: Record<string, any>): void {};

	handleEvent(event: GameEvent): void {
		switch(event.type) {
			case GameEvents.PICKUP_ITEM: {
				this.handleItemPickupEvent(event);
				break;
			}
			case EnemyActions.ATTACK: {
				this.handleEnemyAttackEvent(event);
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
	private handleItemPickupEvent(event: GameEvent): void {
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
	private handleEnemyAttackEvent(event: GameEvent): void {
		this.health -= 1;
		this.emitter.fireEvent(PlayerEvents.HEALTH_CHANGE, {amount: this.health});
	}

	destroy(): void {}
} 