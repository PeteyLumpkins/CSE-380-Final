import State from "../../../../Wolfie2D/DataTypes/State/State";
import StateMachine from "../../../../Wolfie2D/DataTypes/State/StateMachine";
import AnimatedSprite from "../../../../Wolfie2D/Nodes/Sprites/AnimatedSprite";
import GameEvent from "../../../../Wolfie2D/Events/GameEvent";

import PlayerController from "../PlayerController";
import { GameEventType } from "../../../../Wolfie2D/Events/GameEventType";
import { PlayerStat } from "../PlayerStats";

export default abstract class PlayerState extends State {

	parent: PlayerController;
    owner: AnimatedSprite;

	/** This represents the current animation being played */
	protected animation: string;

	constructor(parent: StateMachine, owner: AnimatedSprite){
		super(parent);
		this.owner = owner;
	}

    handleInput(event: GameEvent): void {
		switch(event.type) {
			case EnemyActions.ATTACK: {
				this.handleEnemyAttackEvent(event);
				break;
			}
			case GameEvents.PICKUP_ITEM: {
				this.handleItemPickupEvent(event);
				break;
			}
			case StoreEvent.ITEM_PURCHASED: {
				this.handleItemPurchaseEvent(event);
				break;
			}
			default: {
				console.warn("Unknown/uncaught event was seen in player state with type: " + event.type);
				break;
			}
		}
	}

	handleEnemyAttackEvent(event: GameEvent): void {
		let damageResist = this.parent.playerStats.getStat(PlayerStat.DMG_RESIST) !== null ? this.parent.playerStats.getStat(PlayerStat.DMG_RESIST) : 1;
		let damage = event.data.get("damage") / damageResist;

		if (this.owner.position.distanceTo(event.data.get("attacker").position) <= event.data.get("attackRange")) {
			this.parent.playerStats.setStat(PlayerStat.HEALTH, this.parent.playerStats.getStat(PlayerStat.HEALTH) - damage);
		}	
	}

	handleItemPickupEvent(event: GameEvent): void {
		let pickupType = event.data.get("type");
		switch(pickupType) {
			case PickupTypes.HEALTH: {
				this.parent.playerStats.setStat(PlayerStat.HEALTH, this.parent.playerStats.getStat(PlayerStat.HEALTH) + event.data.get("amount"));
				break;
			}
			case PickupTypes.MONEY: {
				this.parent.playerStats.setStat(PlayerStat.MONEY, this.parent.playerStats.getStat(PlayerStat.MONEY) + event.data.get("amount"));
				break;
			}
			case PickupTypes.ITEM: {
				this.parent.addItem(event.data.get('itemKey'));
				break;
			}
			default: {
				console.log(`Unrecognized type on pickup event: ${event.data.get("type")}`);
				break;
			}
		}
	}

	handleItemPurchaseEvent(event: GameEvent): void {
		let cost = event.data.get("cost");
		let itemKey = event.data.get("itemKey");
		let buy = event.data.get("buy");

		if (cost <= this.parent.playerStats.getStat(PlayerStat.MONEY)) {
			this.parent.playerStats.setStat(PlayerStat.MONEY, this.parent.playerStats.getStat(PlayerStat.MONEY) - cost);
			this.parent.addItem(itemKey);
			buy();
			this.emitter.fireEvent(GameEventType.PLAY_SOUND, {key: "buySound", loop: false, holdReference: true});
		} else {
			this.emitter.fireEvent(GameEventType.PLAY_SOUND, {key: "invalidbuy", loop: false, holdReference: true});
		}
	}

}

import { IdleLeft, IdleRight, IdleDown, IdleUp } from "./Idle/Idle";
import { MovingLeft, MovingRight, MovingDown, MovingUp } from "./Moving/Moving";
import { PunchLeft, PunchRight, PunchDown, PunchUp } from "./Punch/Punch";
import { EnemyActions, GameEvents } from "../../../GameEnums";
import { PickupTypes } from "../../Pickup/PickupTypes";
import { StoreEvent } from "../../../GameSystems/StoreManager";

export {
	IdleLeft, IdleRight, IdleDown, IdleUp,
	MovingLeft, MovingRight, MovingDown, MovingUp,
	PunchLeft, PunchRight, PunchDown, PunchUp
}