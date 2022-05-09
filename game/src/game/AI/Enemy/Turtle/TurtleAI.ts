import EnemyAI from "../EnemyAI";
import GameNode from "../../../../Wolfie2D/Nodes/GameNode";
import GameEvent from "../../../../Wolfie2D/Events/GameEvent";
import Timer from "../../../../Wolfie2D/Timing/Timer";

import { PlayerEvents } from "../../Player/PlayerController";
import { GameEventType } from "../../../../Wolfie2D/Events/GameEventType";

import TurtleIdle from "./TurtleStates/TurtleIdle";
import TurtleAttack from "./TurtleStates/TurtleAttack";
import TurtleKnockback from "./TurtleStates/TurtleKnockback";
import TurtleMove from "./TurtleStates/TurtleMove";
import TurtleDead from "./TurtleStates/TurtleDead";

import AttackAction from "../Actions/AttackAction";
import MoveAction from "../Actions/MoveAction";


export enum TurtleAIStates {
    IDLE = "TURTLE_IDLE_STATE",
    MOVE = "TURTLE_MOVING_STATE",
    ATTACK = "TURTLE_ATTACKING_STATE",
    KNOCK_BACK = "TURTLE_KNOCKED_BACK_STATE",
    DEAD = "TURTLE_DEAD_STATE"
}

export enum TurtleAIEvents {
    PLAYER_SEEN = "TURTLE_PLAYER_SEEN_EVENT"
}

export enum TurtleAIOptionType {
    DEFAULT = "DEFAULT_TURTLE_OPTIONS",
    FAST = "FAST_TURTLE_OPTIONS",
    SLOW = "SLOW_TURTLE_OPTIONS"
}

export default class TurtleAI extends EnemyAI {

    /** Actions that the Turtle can perform/undergo kinda will go here? */
    attack = new AttackAction({amount: 2});
    move = new MoveAction("navmesh", 100, true);
    knockback = new MoveAction("navmesh", 200, true);

    /** Custom attributes specific to the Turtle ai go here */
    maxHealth: number;
    health: number;

    sightRange: number;
    swarmRange: number;

    moveSpeed: number;
    
    attackRange: number;
    attackDamage: number;

    /** Cooldown timers for the knockback and attack of the Turtle */
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
                console.log("Caught player attacked event in TurtleAI");
                this.handlePlayerAttackEvent(event);
                break;
            }
            default: {
                console.log("Unhandled event caught in TurtleAI");
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
                this.changeState(TurtleAIStates.KNOCK_BACK);
            }
        }
    }

    /** Initialize custom attributes for Turtle */
    initOptions(options: Record<string, any>): void {
        this.maxHealth = options.health;
        this.health = options.health;

        this.sightRange = options.sightRange;
        this.swarmRange = options.swarmRange;

        this.moveSpeed = options.moveSpeed;
        console.log("creating turtle with move speed: "+ this.moveSpeed);
        this.move = new MoveAction("navmesh", this.moveSpeed, true);
        this.attackRange = options.attackRange;
        this.attackDamage = options.attackDamage;
    }

    /** Initialize custom states for Turtle */
    initStates(): void {
        this.addState(TurtleAIStates.IDLE, new TurtleIdle(this, this.owner));
        this.addState(TurtleAIStates.ATTACK, new TurtleAttack(this, this.owner));
        this.addState(TurtleAIStates.DEAD, new TurtleDead(this, this.owner));
        this.addState(TurtleAIStates.MOVE, new TurtleMove(this, this.owner));
        this.addState(TurtleAIStates.KNOCK_BACK, new TurtleKnockback(this, this.owner));

        this.initialize(TurtleAIStates.IDLE);
    }

    /** Subscribe to any Turtle specific events that the Turtles need to know about */
    subscribeToEvents(): void {
        this.receiver.subscribe(TurtleAIEvents.PLAYER_SEEN);
        this.receiver.subscribe(PlayerEvents.ATTACKED);
    }

    /**
     * This is a builder for the options that are to be fed to a TurtleAI. Basically, it allows you to create a
     * set of TurtleAIOptions from a template. Once the options are returned, they can be tweaked and tuned 
     * however you want.
     * 
     * @param type the type of TurtleAIOption we want to give to our TurtleAI - defined in the enum TurtleAIOptions 
     * @param target the player node to add to the options 
     * @returns a set of options for a TurtleAI
     */
    public static optionsBuilder(type: TurtleAIOptionType, target: GameNode): Record<string, any> {

        let optionsTemplate: Record<string, any>;

        switch(type) {

            case TurtleAIOptionType.DEFAULT: {
                optionsTemplate = {
                    target: target,
                    health: 10,
                    sightRange: 100,
                    swarmRange: 50,
                    moveSpeed: 25,
                    attackRange: 25, 
                    attackDamage: 2
                }
                break;
            }
            case TurtleAIOptionType.FAST: {
                optionsTemplate = {
                    target: target,
                    health: 7,
                    sightRange: 200,
                    swarmRange: 50,
                    moveSpeed: 35,
                    attackRange: 25, 
                    attackDamage: 1
                }
                break;
            }
            default: 
                throw new Error(`Invalid Turtle options type: ${type}`);
        }

        return optionsTemplate;
    }
}