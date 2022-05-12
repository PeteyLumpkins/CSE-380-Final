import EnemyAI from "../EnemyAI";
import GameNode from "../../../../Wolfie2D/Nodes/GameNode";
import GameEvent from "../../../../Wolfie2D/Events/GameEvent";
import Timer from "../../../../Wolfie2D/Timing/Timer";


import { PlayerEvents } from "../../Player/PlayerController";
import AttackAction, { AttackActionType } from "../Actions/AttackAction";
import MoveAction, { MoveActionType } from "../Actions/MoveAction";

import { 
    RatIdleLeft, RatIdleRight, 
    RatAttackLeft, RatAttackRight,
    RatDyingLeft, RatDyingRight,
    RatHitLeft, RatHitRight,
    RatMoveLeft, RatMoveRight,
    RatDead
} from "./RatStates/RatState";


export enum RatAIStates {
    IDLE_LEFT = "RAT_IDLE_LEFT_STATE",
    IDLE_RIGHT = "RAT_IDLE_RIGHT_STATE",

    MOVE_LEFT = "RAT_MOVE_LEFT_STATE",
    MOVE_RIGHT = "RAT_MOVE_RIGHT_STATE",

    ATTACK_LEFT = "RAT_ATTACK_LEFT_STATE",
    ATTACK_RIGHT = "RAT_ATTACK_RIGHT_STATE",

    DEAD = "RAT_DEAD_STATE",

    HURT_LEFT = "RAT_HURT_LEFT_STATE",
    HURT_RIGHT = "RAT_HURT_RIGHT_STATE",

    DYING_LEFT = "RAT_DYING_LEFT_STATE",
    DYING_RIGHT = "RAT_DYING_RIGHT_STATE",
}

export enum RatAIEvents {
    PLAYER_SEEN = "RAT_PLAYER_SEEN_EVENT",
    RAT_DEAD = "RAT_DEAD_EVENT",
    RAT_HIT_OVER = "RAT_HIT_OVER_EVENT",
    RAT_DROP_ITEM = "RAT_DROP_ITEM_EVENT"
}

export enum RatAIOptionType {
    DEFAULT = "DEFAULT_RAT_OPTIONS",
    FAST = "FAST_RAT_OPTIONS",
    SLOW = "SLOW_RAT_OPTIONS"
}

export default class RatAI extends EnemyAI {

    /** Actions that the rat can perform/undergo kinda will go here? */
    attack: AttackAction;
    move: MoveAction;
    knockback: MoveAction;

    /** Custom attributes specific to the rat ai go here */
    maxHealth: number;
    health: number;

    sightRange: number;
    swarmRange: number;

    moveSpeed: number;
    
    attackRange: number;
    attackDamage: number;

    /** Cooldown timers for the knockback and attack of the rat */
    attackCooldownTimer: Timer = new Timer(2000);

    /** Initialize custom attributes for Rat */
    initOptions(options: Record<string, any>): void {
        this.maxHealth = options.health;
        this.health = options.health;

        this.sightRange = options.sightRange;
        this.swarmRange = options.swarmRange;

        this.moveSpeed = options.moveSpeed;
        this.attackRange = options.attackRange;
        this.attackDamage = options.attackDamage;

        this.attack = AttackAction.attackActionBuilder(options.attackAction, this.owner);
        this.move = MoveAction.moveActionBuilder(options.moveAction, "navmesh", true);
        this.knockback = MoveAction.moveActionBuilder(options.knockbackAction, "navmesh", true);
    }

    /** Initialize custom states for Rat */
    initStates(): void {
        this.addState(RatAIStates.IDLE_LEFT, new RatIdleLeft(this, this.owner));
        this.addState(RatAIStates.IDLE_RIGHT, new RatIdleRight(this, this.owner));

        this.addState(RatAIStates.HURT_LEFT, new RatHitLeft(this, this.owner));
        this.addState(RatAIStates.HURT_RIGHT, new RatHitRight(this, this.owner));

        this.addState(RatAIStates.MOVE_LEFT, new RatMoveLeft(this, this.owner));
        this.addState(RatAIStates.MOVE_RIGHT, new RatMoveRight(this, this.owner));

        this.addState(RatAIStates.ATTACK_LEFT, new RatAttackLeft(this, this.owner));
        this.addState(RatAIStates.ATTACK_RIGHT, new RatAttackRight(this, this.owner));

        this.addState(RatAIStates.DYING_LEFT, new RatDyingLeft(this, this.owner));
        this.addState(RatAIStates.DYING_RIGHT, new RatDyingRight(this, this.owner));
        
        this.addState(RatAIStates.DEAD, new RatDead(this, this.owner));

        this.initialize(RatAIStates.IDLE_LEFT);
    }

    /** Subscribe to any rat specific events that the rats need to know about */
    subscribeToEvents(): void {
        this.receiver.subscribe(RatAIEvents.PLAYER_SEEN);
        this.receiver.subscribe(PlayerEvents.ATTACKED);
        this.receiver.subscribe(RatAIEvents.RAT_HIT_OVER);
        this.receiver.subscribe(RatAIEvents.RAT_DEAD);
    }

    /**
     * This is a builder for the options that are to be fed to a RatAI. Basically, it allows you to create a
     * set of RatAIOptions from a template. Once the options are returned, they can be tweaked and tuned 
     * however you want.
     * 
     * @param type the type of RatAIOption we want to give to our RatAI - defined in the enum RatAIOptions 
     * @param target the player node to add to the options 
     * @returns a set of options for a RatAI
     */
    public static optionsBuilder(type: RatAIOptionType, target: GameNode): Record<string, any> {

        let optionsTemplate: Record<string, any>;

        switch(type) {
            case RatAIOptionType.DEFAULT: {
                optionsTemplate = {
                    target: target,

                    attackAction: AttackActionType.BLACK_RAT,
                    moveAction: MoveActionType.DEFAULT_RAT_MOVE,
                    knockbackAction: MoveActionType.DEFAULT_RAT_KNOCKBACK,

                    health: 5,
                    sightRange: 100,
                    swarmRange: 50,
                    moveSpeed: 100,
                    attackRange: 40, 
                    attackDamage: 1
                }
                break;
            }
            case RatAIOptionType.FAST: {
                optionsTemplate = {
                    target: target,

                    attackAction: AttackActionType.WHITE_RAT,
                    moveAction: MoveActionType.FAST_RAT_MOVE,
                    knockbackAction: MoveActionType.FAST_RAT_KNOCKBACK,

                    health: 2,
                    sightRange: 200,
                    swarmRange: 50,
                    moveSpeed: 200,
                    attackRange: 40, 
                    attackDamage: 1
                }
                break;
            }
            default: 
                throw new Error(`Invalid Rat options type: ${type}`);
        }

        return optionsTemplate;
    }
}