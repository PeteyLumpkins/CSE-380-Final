import EnemyAI from "../EnemyAI";
import GameNode from "../../../../Wolfie2D/Nodes/GameNode";
import GameEvent from "../../../../Wolfie2D/Events/GameEvent";
import Timer from "../../../../Wolfie2D/Timing/Timer";

import { PlayerEvents } from "../../Player/PlayerController";
import { GameEventType } from "../../../../Wolfie2D/Events/GameEventType";

import AttackAction from "../Actions/AttackAction";
import MoveAction from "../Actions/MoveAction";

export enum GooseAIStates {
    IDLE_LEFT = "GOOSE_IDLE_LEFT_STATE",
    IDLE_RIGHT = "GOOSE_IDLE_RIGHT_STATE",

    MOVE_LEFT = "GOOSE_MOVE_LEFT_STATE",
    MOVE_RIGHT = "GOOSE_MOVE_RIGHT_STATE",

    ATTACK_LEFT = "GOOSE_ATTACK_LEFT_STATE",
    ATTACK_RIGHT = "GOOSE_ATTACK_RIGHT_STATE",

    KNOCK_BACK = "GOOSE_KNOCKED_BACK_STATE",
    DEAD = "GOOSE_DEAD_STATE"
}

export default class GooseAI extends EnemyAI {

    /** Actions that the goose can perform/undergo kinda will go here? */
    attackAction = new AttackAction({amount: 2});
    moveAction = new MoveAction("navmesh", 100, true);
    knockbackAction = new MoveAction("navmesh", 200, true);

    /** Custom attributes specific to the goose ai go here */
    maxHealth: number;
    health: number;

    sightRange: number;
    moveSpeed: number;
    
    attackRange: number;
    attackDamage: number;

    /** Cooldown timers for the knockback and attack of the goose */
    attackCooldownTimer: Timer = new Timer(2000);
    knockbackCooldownTimer: Timer = new Timer(2000);

    initStates(): void {
        
    }

    initOptions(options: Record<string, any>): void {
        throw new Error("Method not implemented.");
    }

    subscribeToEvents(): void {
        this.receiver.subscribe(PlayerEvents.ATTACKED);
    }
    
}