import EnemyAI from "../EnemyAI";
import GameNode from "../../../../Wolfie2D/Nodes/GameNode";
import GameEvent from "../../../../Wolfie2D/Events/GameEvent";
import Timer from "../../../../Wolfie2D/Timing/Timer";

import { PlayerEvents } from "../../Player/PlayerController";
import { GameEventType } from "../../../../Wolfie2D/Events/GameEventType";

import AttackAction from "../Actions/AttackAction";
import MoveAction from "../Actions/MoveAction";

import {
    GooseAttackRight, GooseAttackLeft,  
    GooseMoveRight, GooseMoveLeft,
    GooseHitRight, GooseHitLeft, 
    GooseDyingRight, GooseDyingLeft,
    GooseDead
} from "./GooseStates/GooseState";

export enum GooseAIEvents {
    ATTACK_FINISHED = "GOOSE_ATTACK_FINISHED_EVENT",
    PLAYER_SEEN = "GOOSE_PLAYER_SEEN_EVENT",
    TOOK_DAMAGE = "GOOSE_TOOK_DAMAGE_EVENT",
    HIT_OVER = "GOOSE_HIT_OVER_EVENT",
    DYING_OVER = "GOOSE_DYING_OVER_EVENT"
}

export enum GooseAIStates {
    IDLE = "GOOSE_IDLE_STATE",

    MOVE_LEFT = "GOOSE_MOVE_LEFT_STATE",
    MOVE_RIGHT = "GOOSE_MOVE_RIGHT_STATE",

    ATTACK_LEFT = "GOOSE_ATTACK_LEFT_STATE",
    ATTACK_RIGHT = "GOOSE_ATTACK_RIGHT_STATE",

    HIT_LEFT = "GOOSE_HIT_LEFT_STATE",
    HIT_RIGHT = "GOOSE_HIT_RIGHT_STATE",

    DYING_LEFT = "GOOSE_DYING_LEFT_STATE",
    DYING_RIGHT = "GOOSE_DYING_RIGHT_STATE",

    DEAD = "GOOSE_DEAD_STATE"
}

export default class GooseAI extends EnemyAI {

    attackAction: AttackAction;
    moveAction = new MoveAction("navmesh", 100, true);
    knockbackAction = new MoveAction("navmesh", 200, true);

    /** Custom attributes specific to the goose ai go here */
    maxHealth: number;
    health: number;
    sightRange: number;
    moveSpeed: number;
    attackRange: number;
    attackDamage: number;

    initStates(): void {

        this.addState(GooseAIStates.ATTACK_LEFT, new GooseAttackLeft(this, this.owner));
        this.addState(GooseAIStates.ATTACK_RIGHT, new GooseAttackRight(this, this.owner));

        this.addState(GooseAIStates.MOVE_LEFT, new GooseMoveLeft(this, this.owner));
        this.addState(GooseAIStates.MOVE_RIGHT, new GooseMoveRight(this, this.owner));

        this.addState(GooseAIStates.HIT_LEFT, new GooseHitLeft(this, this.owner));
        this.addState(GooseAIStates.HIT_RIGHT, new GooseHitRight(this, this.owner));

        this.addState(GooseAIStates.DYING_LEFT, new GooseDyingLeft(this, this.owner));
        this.addState(GooseAIStates.DYING_RIGHT, new GooseDyingRight(this, this.owner));

        this.addState(GooseAIStates.DEAD, new GooseDead(this, this.owner));

    }

    initOptions(options: Record<string, any>): void {
        this.maxHealth = options.health;
        this.health = options.health;
        this.sightRange = options.sightRange;
        this.moveSpeed = options.moveSpeed;
        this.attackRange = options.attackRange;
        this.attackDamage = options.attackDamage;
    }

    subscribeToEvents(): void {
        this.receiver.subscribe(PlayerEvents.ATTACKED);
        this.receiver.subscribe(GooseAIEvents.DYING_OVER);
        this.receiver.subscribe(GooseAIEvents.PLAYER_SEEN);
        this.receiver.subscribe(GooseAIEvents.HIT_OVER);
    }
    
}