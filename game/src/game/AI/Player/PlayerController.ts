import ResourceManager from "../../../Wolfie2D/ResourceManager/ResourceManager";
import AnimatedSprite from "../../../Wolfie2D/Nodes/Sprites/AnimatedSprite";
import StateMachineAI from "../../../Wolfie2D/AI/StateMachineAI";
import AABB from "../../../Wolfie2D/DataTypes/Shapes/AABB";
import Vec2 from "../../../Wolfie2D/DataTypes/Vec2";
import Input from "../../../Wolfie2D/Input/Input";
import { GameEventType } from "../../../Wolfie2D/Events/GameEventType";

import {

	IdleLeft, IdleRight, IdleDown, IdleUp,
	MovingLeft, MovingRight, MovingDown, MovingUp,
	PunchLeft, PunchRight, PunchDown, PunchUp,
	HurtLeft, HurtRight, HurtDown, HurtUp,
	Dying

} from "./PlayerStates/PlayerState";

import { GameEvents, EnemyActions } from "../../GameEnums";
import { PickupTypes } from "../Pickup/PickupTypes";
import { StoreEvent } from "../../GameSystems/StoreManager";
import PlayerStats from "./PlayerStats";
import PickupAI from "../Pickup/PickupAI";
import PlayerInventory from "./PlayerInventory";

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
	PUNCH_DOWN = "PUNCH_DOWN_PLAYER_STATE",
	PUNCH_UP = "PUNCH_UP_PLAYER_STATE",

	HURT_RIGHT = "HURT_RIGHT_PLAYER_STATE",
	HURT_LEFT = "HURT_LEFT_PLAYER_STATE",
	HURT_DOWN = "HURT_DOWN_PLAYER_STATE",
	HURT_UP = "HURT_UP_PLAYER_STATE",

	DYING = "DYING_PLAYER_STATE"
}

export enum PlayerEvents {
	ATTACKED = "PLAYER_EVENT_ATTACKED",
	HEALTH_CHANGE = "PLAYER_EVENT_HEALTH_CHANGE",
	MONEY_CHANGE = "PLAYER_EVENT_MONEY_CHANGE",
	ATTACK_ENDED = "PLAYER_EVENT_ATTACK_ENDED",
	HURT_ENDED = "PLAYER_EVENT_HURT_ENDED",
	PLAYER_DIED = "PLAYER_EVENT_PLAYER_DIED"
}

export default class PlayerController extends StateMachineAI {

	/* CHEAT FLAGS */
	invincible: boolean;
 	instakill: boolean;

	/* PLAYER HIT BOX SCALE */
	hitboxScale: number;
	
	/* PLAYER GAME NODE */
	owner: AnimatedSprite;

	/* PLAYER INVENTORY */
	playerInventory: PlayerInventory;

	/* PLAYER STATS */
	playerStats: PlayerStats;

	initializeAI(owner: AnimatedSprite, options: Record<string, any>): void {
		this.owner = owner;
		this.playerInventory = options.inventory;
		this.playerStats = options.stats;

		this.invincible = false;
		this.instakill = false;
		this.hitboxScale = 1/2;

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

		this.addState(PlayerStates.HURT_LEFT, new HurtLeft(this, this.owner));
		this.addState(PlayerStates.HURT_RIGHT, new HurtRight(this, this.owner));
		this.addState(PlayerStates.HURT_DOWN, new HurtDown(this, this.owner));
		this.addState(PlayerStates.HURT_UP, new HurtUp(this, this.owner));

		this.addState(PlayerStates.DYING, new Dying(this, this.owner));
		
        this.initialize(PlayerStates.IDLE_RIGHT);

		this.receiver.subscribe(StoreEvent.ITEM_PURCHASED);
		this.receiver.subscribe(PlayerEvents.HURT_ENDED);
		this.receiver.subscribe(GameEvents.PICKUP_ITEM);
		this.receiver.subscribe(EnemyActions.ATTACK);
		this.receiver.subscribe(PlayerEvents.ATTACK_ENDED);
		this.receiver.subscribe(PlayerEvents.PLAYER_DIED);
	}

	activate(options: Record<string, any>): void {};

	update(deltaT: number): void {

		/** CHEAT CODE STUFF */
		if (this.getInvincible()) {
			this.invincible = true;
		}
		if (this.getInstakill()) {
			this.instakill = true;
		}
		if (this.getMaxMoney()) {
			this.playerStats.setStat("MONEY", 999);
		}

		/** DROPPING ITEMS */
		let droppedItemIndex = this.getDroppedItem();
		if (droppedItemIndex >= 1) {
			this.handleItemDropEvent(droppedItemIndex - 1);
		}

		// Updating the state machine will trigger the current state to be updated.
		super.update(deltaT);
	}

	private handleItemDropEvent(index: number): void {
		this.removeItem(index);
	}

	/** METHODS FOR GETTING USER INPUT */

	getDroppedItem(): number {
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
	getInvincible(): boolean {
		return Input.isPressed("invincible")
	}
	getInstakill(): boolean {
		return Input.isPressed("instakill");
	}
	getMaxMoney(): boolean {
		return Input.isPressed("999money");
	}
	getInputDirection(): Vec2 {
		let direction = Vec2.ZERO;
		direction.x = (Input.isPressed("left") ? -1 : 0) + (Input.isPressed("right") ? 1 : 0);
		direction.y = (Input.isPressed("forward") ? -1 : 0) + (Input.isPressed("backward") ? 1: 0);
		return direction;
	}
	getAttacking(): boolean {
		return Input.isJustPressed("attack");
	}

	/** METHODS FOR GETTING PLAYER HIT BOXES */

	getDownHitbox(): AABB {
		let y = this.owner.boundary.bottomRight.y;
        let x = this.owner.position.x;
        return new AABB(new Vec2(x, y), new Vec2(this.owner.boundary.halfSize.x * this.hitboxScale, this.owner.boundary.halfSize.y * this.hitboxScale));
	}
	getLeftHitbox(): AABB {
		let y = this.owner.position.y;
        let x = this.owner.boundary.topLeft.x;
        return new AABB(new Vec2(x, y), new Vec2(this.owner.boundary.halfSize.x * this.hitboxScale, this.owner.boundary.halfSize.y * this.hitboxScale));
	}
	getRightHitbox(): AABB {
		let y = this.owner.position.y;
        let x = this.owner.boundary.topRight.x;
        return new AABB(new Vec2(x, y), new Vec2(this.owner.boundary.halfSize.x * this.hitboxScale, this.owner.boundary.halfSize.y * this.hitboxScale));
	}
	getUpHitbox(): AABB {
		let y = this.owner.boundary.topRight.y;
        let x = this.owner.position.x;
        return new AABB(new Vec2(x, y), new Vec2(this.owner.boundary.halfSize.x * this.hitboxScale, this.owner.boundary.halfSize.y * this.hitboxScale));
	}

	/** METHODS FOR WORKING WITH PLAYER INVENTORY AND STATS */

	addItem(itemKey: string): void {
		let item = this.playerInventory.addItem(itemKey);
		if (item === null) {
			this.addItemDrop(itemKey);
		} else {
			let buffs = ResourceManager.getInstance().getObject("item-data")[itemKey].buffs;
			this.playerStats.addBuffs(buffs);
		}
	}
	private removeItem(index: number): void {
		let itemKey = this.playerInventory.removeItem(index);
		if (itemKey !== null) {
			let buffs = ResourceManager.getInstance().getObject("item-data")[itemKey].buffs;
			this.playerStats.removeBuffs(buffs);
			this.addItemDrop(itemKey);
		}
	}
	private addItemDrop(itemKey: string): void {
		let itemDrop = this.owner.getScene().add.sprite(itemKey, this.owner.getLayer().getName())
		itemDrop.position.set(this.owner.position.x, this.owner.position.y);
		itemDrop.scale.set(2, 2);
		itemDrop.addAI(PickupAI, {
			canPickup: () => {
				return this.owner.position.distanceTo(itemDrop.position) <= 50;
			},
			pickup: () => {
				return Input.isPressed("pickup");
			},
			data: {
				type: PickupTypes.ITEM,
				itemKey: itemKey
			}
		});
		this.emitter.fireEvent(GameEventType.PLAY_SOUND, {key: "itemdrop", loop: false, holdReference: true});
	}
} 