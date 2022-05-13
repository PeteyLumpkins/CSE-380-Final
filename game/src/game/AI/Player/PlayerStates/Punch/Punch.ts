import Vec2 from "../../../../../Wolfie2D/DataTypes/Vec2";
import Timer from "../../../../../Wolfie2D/Timing/Timer";
import AABB from "../../../../../Wolfie2D/DataTypes/Shapes/AABB";

import { PlayerEvents, PlayerStates } from "../../PlayerController";
import PlayerState from "../PlayerState";

export default abstract class Punch extends PlayerState {

    /** STATE METHODS */

    onEnter(options: Record<string, any> ): void {
        this.owner.animation.playIfNotAlready(this.animation, false, PlayerEvents.ATTACK_ENDED);
    }

    handleInput(event: GameEvent): void {
        switch(event.type) {
            case PlayerEvents.ATTACK_ENDED: {
                this.sendPlayerAttacked();
                break;
            }
            default: {
                super.handleInput(event);
                break;
            }
        }
    }

    update(deltaT: number): void {}

    onExit(): Record<string, any> { return; }

    sendPlayerAttacked(): void {
        let damage = this.parent.playerStats.getStat(PlayerStat.ATTACK_DMG) !== null ? this.parent.playerStats.getStat(PlayerStat.ATTACK_DMG) : 1;
        let hitbox = this.getHitbox();

        if (this.parent.instakill) { damage = Infinity; }

        this.emitter.fireEvent(PlayerEvents.ATTACKED, {hitbox: hitbox, damage: damage});

        this.idle();
    }

    abstract idle(): void;

    abstract getHitbox(): AABB;

}

import PunchLeft from "./PunchLeft";
import PunchRight from "./PunchRight";
import PunchDown from "./PunchDown";
import PunchUp from "./PunchUp";
import { PlayerStat } from "../../PlayerStats";
import GameEvent from "../../../../../Wolfie2D/Events/GameEvent";

export { PunchLeft, PunchRight, PunchDown, PunchUp }