import GameEvent from "../../../Wolfie2D/Events/GameEvent";
import AnimatedSprite from "../../../Wolfie2D/Nodes/Sprites/AnimatedSprite";
import StateMachineAI from "../../../Wolfie2D/AI/StateMachineAI";
import OrthogonalTilemap from "../../../Wolfie2D/Nodes/Tilemaps/OrthogonalTilemap";
import { StoreEvent } from "../../GameSystems/StoreManager";

import {

	IdleLeft, IdleRight, IdleDown, IdleUp,
	MovingLeft, MovingRight, MovingDown, MovingUp,
	PunchLeft, PunchRight, PunchDown, PunchUp

} from "./PlayerStates/PlayerState";

import { GameEvents, EnemyActions } from "../../GameEnums";
import { PickupTypes } from "../Pickup/PickupTypes";
import { PlayerStat } from "../../Player/PlayerStats";
import { GameEventType } from "../../../Wolfie2D/Events/GameEventType";

import PlayerStats from "../../Player/PlayerStats";
import PlayerInventory from "../../Player/PlayerInventory";
import Input from "../../../Wolfie2D/Input/Input";

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

	owner: AnimatedSprite;
	playerInventory: PlayerInventory;
	playerStats: PlayerStats;
	

	initializeAI(owner: AnimatedSprite, options: Record<string, any>): void {
		this.owner = owner;
		this.playerInventory = options.inventory;
		this.playerStats = options.stats;

	
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

		let droppedItem = this.dropItem();
		if (droppedItem >= 0) {
			this.handleItemDropEvent(droppedItem);
		}

		while(this.receiver.hasNextEvent()){
			this.handleEvent(this.receiver.getNextEvent());
		}

	}

	// All item pickup events should have a "type"
	private handleItemPickupEvent(event: GameEvent): void {
		switch(event.data.get("type")) {
			case PickupTypes.MONEY: {
				this.emitter.fireEvent(GameEventType.PLAY_SOUND, {key: "coinSound", loop: false, holdReference: true});
				this.playerStats.setStat("MONEY", this.playerStats.getStat("MONEY") + event.data.get("amount"));
				break;
			}
			case PickupTypes.ITEM: {
				// Add item pickup sound affect here
				this.playerInventory.addItem(event.data.get('itemKey'));
				break;
			}
			default: {
				console.log(`Unrecognized type on pickup event: ${event.data.get("type")}`);
				break;
			}
		}
	}

	private handleItemDropEvent(index: number): void {
		this.playerInventory.removeItem(index - 1);
	}

	// TODO: handles when an enemy trys to attack the player
	private handleEnemyAttackEvent(event: GameEvent): void {
		/** Checks to see if player has a damage resisit buff applied? */
		let damageResist = this.playerStats.getStat(PlayerStat.DMG_RESIST) !== null ? this.playerStats.getStat(PlayerStat.DMG_RESIST) : 1;
		let damage = event.data.get("amount") / damageResist;

		console.log("Taking damagee with damage resist appliied: " + damage);
		this.playerStats.setStat(PlayerStat.HEALTH, this.playerStats.getStat(PlayerStat.HEALTH) - damage)
	}

	private dropItem(): number {
		switch(true) {
			case Input.isJustPressed("drop1"): {
				return 1;
			}
			case Input.isJustPressed("drop2"): {
				return 2;
			}
			case Input.isJustPressed("drop3"): {
				return 3;
			}
			case Input.isJustPressed("drop4"): {
				return 4;
			}
			case Input.isJustPressed("drop5"): {
				return 5;
			}
			case Input.isJustPressed("drop6"): {
				return 6;
			}
			case Input.isJustPressed("drop7"): {
				return 7;
			}
			case Input.isJustPressed("drop8"): {
				return 8;
			}
			case Input.isJustPressed("drop9"): {
				return 9;
			}
			default: {
				return -1;
			}
		}
	}

	destroy(): void {}
} 