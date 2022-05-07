import EnemyAI from "../EnemyAI";
import GameNode from "../../../../Wolfie2D/Nodes/GameNode";
import GameEvent from "../../../../Wolfie2D/Events/GameEvent";
import Timer from "../../../../Wolfie2D/Timing/Timer";

import { PlayerEvents } from "../../Player/PlayerController";
import { GameEventType } from "../../../../Wolfie2D/Events/GameEventType";

import RatIdle from "./RatStates/RatIdle";
import RatAttack from "./RatStates/RatAttack";
import RatKnockback from "./RatStates/RatKnockback";
import RatMove from "./RatStates/RatMove";
import RatDead from "./RatStates/RatDead";

import AttackAction from "../Actions/AttackAction";
import MoveAction from "../Actions/MoveAction";


export enum RatAIStates {
    IDLE = "RAT_IDLE_STATE",
    MOVE = "RAT_MOVING_STATE",
    ATTACK = "RAT_ATTACKING_STATE",
    KNOCK_BACK = "RAT_KNOCKED_BACK_STATE",
    DEAD = "RAT_DEAD_STATE"
}

export enum RatAIEvents {
    PLAYER_SEEN = "RAT_PLAYER_SEEN_EVENT"
}

export enum RatAIOptionType {
    DEFAULT = "DEFAULT_RAT_OPTIONS",
    FAST = "FAST_RAT_OPTIONS",
    SLOW = "SLOW_RAT_OPTIONS"
}

export default class RatAI extends EnemyAI {

    /** Actions that the rat can perform/undergo kinda will go here? */
    attack = new AttackAction({amount: 2});
    move = new MoveAction("navmesh", 100, true);
    knockback = new MoveAction("navmesh", 200, true);

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
                console.log("Caught player attacked event in RatAI");
                this.handlePlayerAttackEvent(event);
                break;
            }
            default: {
                console.log("Unhandled event caught in RatAI");
                break;
            }
        }
    }

    handlePlayerAttackEvent(event: GameEvent): void {
        if (this.owner.collisionShape.overlaps(event.data.get("hitbox"))) {
            this.emitter.fireEvent(GameEventType.PLAY_SOUND, {key: "hitSound", loop: false, holdReference: true});
            this.health -= event.data.get("damage");
            if (this.knockbackCooldownTimer.isStopped()) {
                this.knockbackCooldownTimer.start();
                this.changeState(RatAIStates.KNOCK_BACK);
            }
        }
    }

    /** Initialize custom attributes for Rat */
    initOptions(options: Record<string, any>): void {
        this.maxHealth = options.health;
        this.health = options.health;

        this.sightRange = options.sightRange;
        this.swarmRange = options.swarmRange;

        this.moveSpeed = options.moveSpeed;
        this.attackRange = options.attackRange;
        this.attackDamage = options.attackDamage;
    }

    /** Initialize custom states for Rat */
    initStates(): void {
        this.addState(RatAIStates.IDLE, new RatIdle(this, this.owner));
        this.addState(RatAIStates.ATTACK, new RatAttack(this, this.owner));
        this.addState(RatAIStates.DEAD, new RatDead(this, this.owner));
        this.addState(RatAIStates.MOVE, new RatMove(this, this.owner));
        this.addState(RatAIStates.KNOCK_BACK, new RatKnockback(this, this.owner));

        this.initialize(RatAIStates.IDLE);
    }

    /** Subscribe to any rat specific events that the rats need to know about */
    subscribeToEvents(): void {
        this.receiver.subscribe(RatAIEvents.PLAYER_SEEN);
        this.receiver.subscribe(PlayerEvents.ATTACKED);
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
                    
                    health: 5,
                    sightRange: 100,
                    swarmRange: 50,
                    moveSpeed: 100,
                    attackRange: 25, 
                    attackDamage: 1
                }
                break;
            }
            case RatAIOptionType.FAST: {
                optionsTemplate = {
                    target: target,
                    
                    health: 2,
                    sightRange: 200,
                    swarmRange: 50,
                    moveSpeed: 150,
                    attackRange: 25, 
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