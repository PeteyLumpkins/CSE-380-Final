import Vec2 from "../../../../../Wolfie2D/DataTypes/Vec2";
import Timer from "../../../../../Wolfie2D/Timing/Timer";
import AABB from "../../../../../Wolfie2D/DataTypes/Shapes/AABB";

import { PlayerEvents, PlayerStates } from "../../PlayerController";
import PlayerState from "../PlayerState";

export default abstract class Punch extends PlayerState {

    protected attackTimer: Timer;
    protected hitbox: AABB;

    onEnter(options: Record<string, any> ): void {

        /** Initialize the attack timer */
        this.attackTimer = new Timer(200, () => {
			this.parent.numAttacks -= 1;
			this.sendPlayerAttacked(this.owner.position);
		});

        /** Start attack timer */
        this.attackTimer.start();

        /** Start the animation */
        this.owner.animation.play(this.animation);
    }

    update(deltaT: number): void {
        super.update(deltaT);

        if (this.attackTimer.isStopped()) {
            this.idle();
        }
    }

    abstract idle(): void;

    sendPlayerAttacked(position: Vec2): void {
        let damage = this.parent.playerStats.getStat(PlayerStat.ATTACK_DMG) !== null ? this.parent.playerStats.getStat(PlayerStat.ATTACK_DMG) : 1;
        if (this.parent.instakill) { damage = Infinity; }
        this.emitter.fireEvent(PlayerEvents.ATTACKED, {position: position, hitbox: this.hitbox, damage: damage});
    }

}

import PunchLeft from "./PunchLeft";
import PunchRight from "./PunchRight";
import PunchDown from "./PunchDown";
import PunchUp from "./PunchUp";
import { PlayerStat } from "../../PlayerStats";

export { PunchLeft, PunchRight, PunchDown, PunchUp }