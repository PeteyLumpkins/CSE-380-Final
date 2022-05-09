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
    NormalGooseIdle, DemonGooseIdle,
    GooseDead
} from "./GooseStates/GooseState";

export enum GooseAIStates {
    IDLE_NORMAL = "GOOSE_IDLE_NORMAL_STATE",
    IDLE_DEMON = "GOOSE_IDLE_DEMON_STATE",

    MOVE_LEFT = "GOOSE_MOVE_LEFT_STATE",
    MOVE_RIGHT = "GOOSE_MOVE_RIGHT_STATE",

    ATTACK_LEFT = "GOOSE_ATTACK_LEFT_STATE",
    ATTACK_RIGHT = "GOOSE_ATTACK_RIGHT_STATE",

    KNOCK_BACK = "GOOSE_KNOCKED_BACK_STATE",
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

    /** Cooldown timers for the knockback and attack of the goose */
    attackCooldownTimer: Timer = new Timer(2000);
    knockbackCooldownTimer: Timer = new Timer(2000);

    update(deltaT: number): void {
        super.update(deltaT);
        while(this.receiver.hasNextEvent()){
			this.handleEvent(this.receiver.getNextEvent());
		}
    }

    handleEvent(event: GameEvent): void {
        switch(event.type) {
            case PlayerEvents.ATTACKED: {
                console.log("Caught player attacked event in GooseAI");
                this.handlePlayerAttackEvent(event);
                break;
            }
            default: {
                console.log("Unhandled event caught in GoooseAI");
                break;
            }
        }
    }

    handlePlayerAttackEvent(event: GameEvent): void {
        if (this.owner.collisionShape.overlaps(event.data.get("hitbox"))) {
            this.emitter.fireEvent(GameEventType.PLAY_SOUND, {key: "hitSound", loop: false, holdReference: true});
            this.health -= event.data.get("damage");
        }
    }

    initStates(): void {

        this.addState(GooseAIStates.ATTACK_LEFT, new GooseAttackLeft(this, this.owner));
        this.addState(GooseAIStates.ATTACK_RIGHT, new GooseAttackRight(this, this.owner));

        this.addState(GooseAIStates.MOVE_LEFT, new GooseMoveLeft(this, this.owner));
        this.addState(GooseAIStates.MOVE_RIGHT, new GooseMoveRight(this, this.owner));

        this.addState(GooseAIStates.DEAD, new GooseDead(this, this.owner));

        this.addState(GooseAIStates.IDLE_DEMON, new DemonGooseIdle(this, this.owner));
        this.addState(GooseAIStates.IDLE_NORMAL, new NormalGooseIdle(this, this.owner));
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
    }
    
}