import EnemyAI from "../EnemyAI";

import RatIdle from "./RatIdle";
import RatActive from "./RatActive";
import RatDead from "./RatDead";

export enum RatStates {
    IDLE = "RAT_IDLE_STATE",
    ACTIVE = "RAT_ACTIVE_STATE",
    DEAD = "RAT_DEAD_STATE"
}

export enum RatEvents {
    PLAYER_SEEN = "RAT_PLAYER_SEEN_EVENT"
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
        this.addState(RatStates.IDLE, new RatIdle(this, this.owner));
        this.addState(RatStates.ACTIVE, new RatActive(this, this.owner));
        this.addState(RatStates.DEAD, new RatDead(this, this.owner));

        this.initialize(RatStates.IDLE);
    }

    subscribeToEvents(): void {
        this.receiver.subscribe(RatEvents.PLAYER_SEEN);
    }


}