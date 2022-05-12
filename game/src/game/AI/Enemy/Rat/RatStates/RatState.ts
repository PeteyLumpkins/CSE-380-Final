import State from "../../../../../Wolfie2D/DataTypes/State/State";
import GameNode from "../../../../../Wolfie2D/Nodes/GameNode";
import Vec2 from "../../../../../Wolfie2D/DataTypes/Vec2";
import Timer from "../../../../../Wolfie2D/Timing/Timer";
import GameEvent from "../../../../../Wolfie2D/Events/GameEvent";
import { GameEventType } from "../../../../../Wolfie2D/Events/GameEventType";

import { PlayerEvents } from "../../../Player/PlayerController";
import RatAI, { RatAIStates } from "../RatAI";

export default abstract class RatState extends State {
    protected parent: RatAI;
    protected owner: GameNode;

    protected animation: string;

    constructor(parent: RatAI, owner: GameNode){
        super(parent);
        this.owner = owner;
    }

    update(deltaT: number): void {}

    handleInput(event: GameEvent): void {
        switch(event.type) {
            case PlayerEvents.ATTACKED: {
                this.handlePlayerAttackEvent(event);
                break;
            }
            default: {
                console.log("Unhandled event caught in rat state");
                break;
            }
        }
    }

    handlePlayerAttackEvent(event: GameEvent): void {
        if (this.owner.collisionShape.overlaps(event.data.get("hitbox"))) {
            this.emitter.fireEvent(GameEventType.PLAY_SOUND, {key: "hitSound", loop: false, holdReference: true});
            this.parent.health -= event.data.get("damage");
            this.takeDamage();
        }
    }

    abstract takeDamage(): void;

    /** Helper methods for getting and working with Rat AI global state */

    protected attackReady(): boolean {
        return this.parent.attackCooldownTimer.isStopped();
    }

    protected isDead(): boolean {
        return this.parent.health <= 0;
    }

    protected inSightRange(position: Vec2) {
        return this.owner.position.distanceTo(position) <= this.parent.sightRange;
    }

    protected inSwarmRange(position: Vec2) {
        return this.owner.position.distanceTo(position) <= this.parent.swarmRange;
    }

    protected inAttackRange(position: Vec2) {
        return this.owner.position.distanceTo(position) <= this.parent.attackRange;
    }
}

import { RatIdleLeft, RatIdleRight } from "./Idle/RatIdle";
import { RatDyingLeft, RatDyingRight } from "./Dying/RatDying";
import { RatHitLeft, RatHitRight } from "./Hit/RatHit";
import { RatMoveLeft, RatMoveRight } from "./Move/RatMove";
import { RatAttackLeft, RatAttackRight } from "./Attack/RatAttack";
import RatDead from "./RatDead";

export {
    RatIdleLeft, RatIdleRight, 
    RatAttackLeft, RatAttackRight,
    RatDyingLeft, RatDyingRight,
    RatHitLeft, RatHitRight,
    RatMoveLeft, RatMoveRight,
    RatDead
}