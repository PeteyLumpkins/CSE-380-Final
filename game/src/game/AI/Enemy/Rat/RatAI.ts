import EnemyAI from "../EnemyAI";
import GameNode from "../../../../Wolfie2D/Nodes/GameNode";
import GameEvent from "../../../../Wolfie2D/Events/GameEvent";
import Vec2 from "../../../../Wolfie2D/DataTypes/Vec2";

import { PlayerEvents } from "../../Player/PlayerController";
import { GameEventType } from "../../../../Wolfie2D/Events/GameEventType";

import RatIdle from "./RatStates/RatIdle";
import RatActive from "./RatStates/RatActive";
import RatDead from "./RatStates/RatDead";

import RatAttack from "./RatActions/RatAttack";
import RatMove from "./RatActions/RatMove";


export enum RatAIStates {
    IDLE = "RAT_IDLE_STATE",
    ACTIVE = "RAT_ACTIVE_STATE",
    DEAD = "RAT_DEAD_STATE"
}

export enum RatAIEvents {
    PLAYER_SEEN = "RAT_PLAYER_SEEN_EVENT"
}

export enum RatAIStatuses {
    IN_RANGE = "RAT_IN_RANGE",
    ATTACK_READY = "RAT_ATTACK_READY",
    GOAL_REACHED = "RAT_GOAL_REACHED"
}

export enum RatAIOptionType {
    DEFAULT = "DEFAULT_RAT_OPTIONS",
    FAST = "FAST_RAT_OPTIONS",
    SLOW = "SLOW_RAT_OPTIONS"
}

export default class RatAI extends EnemyAI {

    /** Custom attributes specific to the rat ai go here */
    maxHealth: number;
    health: number;

    sightRange: number;
    swarmRange: number;

    moveSpeed: number;
    
    attackRange: number;
    attackDamage: number;

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
            // this.owner.move(event.data.get("dir").mult(new Vec2(500, 500)));
        }
    }

    handleKnockBack(dir: Vec2): void {
        this.owner.move(dir.mult(new Vec2(100, 100)));
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
        this.addState(RatAIStates.ACTIVE, new RatActive(this, this.owner));
        this.addState(RatAIStates.DEAD, new RatDead(this, this.owner));

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
     * @param player the player node to add to the options (this is required)
     * @param options any custom options we want to tweak
     * @returns a set of options for a RatAI
     */
    public static optionsBuilder(type: RatAIOptionType, target: GameNode): Record<string, any> {

        let optionsTemplate: Record<string, any>;

        switch(type) {

            case RatAIOptionType.DEFAULT: {
                optionsTemplate = {
                    target: target,
                    goal: RatAIStatuses.GOAL_REACHED,
                    statuses: [],
                    actions: [
                        new RatAttack(3, [RatAIStatuses.IN_RANGE, RatAIStatuses.ATTACK_READY], [RatAIStatuses.GOAL_REACHED]),
                        new RatMove(4, [], [RatAIStatuses.IN_RANGE])
                    ],
                    health: 5,
                    sightRange: 100,
                    swarmRange: 50,
                    moveSpeed: 100,
                    attackRange: 50, 
                    attackDamage: 2
                }
                break;
            }
            case RatAIOptionType.FAST: {
                optionsTemplate = {
                    target: target,
                    goal: RatAIStatuses.GOAL_REACHED,
                    statuses: new Array<string>(),
                    actions: [
                        new RatAttack(3, [RatAIStatuses.IN_RANGE], [RatAIStatuses.GOAL_REACHED]),
                        new RatMove(4, [], [RatAIStatuses.IN_RANGE])
                    ],
                    health: 5,
                    sightRange: 200,
                    swarmRange: 50,
                    moveSpeed: 150,
                    attackRange: 50, 
                    attackDamage: 2
                }
                break;
            }
            default: 
                throw new Error(`Invalid Rat options type: ${type}`);
        }

        return optionsTemplate;
    }
}