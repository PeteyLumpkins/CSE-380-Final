import EnemyAI from "../EnemyAI";
import GameNode from "../../../../Wolfie2D/Nodes/GameNode";
import GameEvent from "../../../../Wolfie2D/Events/GameEvent";

import { PlayerEvents } from "../../Player/PlayerController";
import { GameEventType } from "../../../../Wolfie2D/Events/GameEventType";

import RatIdle from "./RatStates/RatIdle";
import RatActive from "./RatStates/RatActive";
import RatDead from "./RatStates/RatDead";

import RatAttack from "./RatActions/RatAttack";
import RatMove from "./RatActions/RatMove";

import Player from "../../../Player/Player";

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
        super.handleEvent(event);
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
        if (this.owner.position.distanceTo(event.data.get("position")) <= event.data.get("range")) {
            this.emitter.fireEvent(GameEventType.PLAY_SOUND, {key: "hitSound", loop: false, holdReference: true});
            this.health -= event.data.get("damage");
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

    /** Initialize custom state for Rat */
    initStates(): void {
        this.addState(RatAIStates.IDLE, new RatIdle(this, this.owner));
        this.addState(RatAIStates.ACTIVE, new RatActive(this, this.owner));
        this.addState(RatAIStates.DEAD, new RatDead(this, this.owner));

        this.initialize(RatAIStates.IDLE);
    }

    subscribeToEvents(): void {
        this.receiver.subscribe(RatAIEvents.PLAYER_SEEN);
        this.receiver.subscribe(PlayerEvents.ATTACKED);
    }

    /**
     * This is a builder for the options that are to be fed a RatAI. Basically, it allows you to create a
     * set of RatAIOptions from a template. Once the options are returned, they can be tweaked and tuned 
     * however you want.
     * 
     * @param type the type of RatAIOption we want to give to our RatAI - defined in the enum RatAIOptions 
     * @param player the player node to add to the options (this is required)
     * @param options any custom options we want to tweak
     * @returns a set of options for a RatAI
     */
    public static optionsBuilder(type: RatAIOptionType, player: Player): Record<string, any> {

        let optionsTemplate: Record<string, any>;

        switch(type) {

            case RatAIOptionType.DEFAULT: {
                optionsTemplate = {
                    player: player,
                    goal: RatAIStatuses.GOAL_REACHED,
                    statuses: new Array<RatAIStatuses>(),
                    actions: [
                        new RatAttack(3, [RatAIStatuses.IN_RANGE], [RatAIStatuses.GOAL_REACHED]),
                        new RatMove(4, [], [RatAIStatuses.IN_RANGE])
                    ],
                    health: 5,
                    sightRange: 100,
                    swarmRange: 50,
                    moveSpeed: 100,
                    attackRange: 25, 
                    attackDamage: 2
                }
                break;
            }
            case RatAIOptionType.FAST: {
                optionsTemplate = {
                    player: player,
                    goal: RatAIStatuses.GOAL_REACHED,
                    statuses: new Array<RatAIStatuses>(),
                    actions: [
                        new RatAttack(3, [RatAIStatuses.IN_RANGE], [RatAIStatuses.GOAL_REACHED]),
                        new RatMove(4, [], [RatAIStatuses.IN_RANGE])
                    ],
                    health: 5,
                    sightRange: 200,
                    swarmRange: 50,
                    moveSpeed: 150,
                    attackRange: 25, 
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