import Vec2 from "../../../../../Wolfie2D/DataTypes/Vec2";
import Timer from "../../../../../Wolfie2D/Timing/Timer";

import { PlayerStates } from "../../PlayerController";
import PlayerState from "../PlayerState";

export default abstract class Punch extends PlayerState {

    onEnter(options: Record<string, any> ): void {
        this.attackTimer.start();

    }

    update(deltaT: number): void {
        super.update(deltaT);

        let dir = this.getInputDirection();
        let attacking = this.isAttacking();
        console.log(attacking);

        if (attacking) {
            this.attack();
        } else {
            this.attackTimer.reset();
            if (dir.isZero()) {
                this.idle();
            } else {
                this.move(dir);
            }
        }
    }

    abstract idle(): void;

    move(dir: Vec2): void {
        if (dir.x > 0) {
            this.finished(PlayerStates.MOVING_RIGHT);
        } else if (dir.x < 0) {
            this.finished(PlayerStates.MOVING_LEFT);
        } else if (dir.y > 0) {
            this.finished(PlayerStates.MOVING_DOWN);
        } else if (dir.y < 0) {
            this.finished(PlayerStates.MOVING_UP);
        }
    }

    attack(): void {
        if (!this.attackTimer.isStopped()) {
            return;
        }
        this.attackTimer.start();
    }

}

import PunchLeft from "./PunchLeft";
import PunchRight from "./PunchRight";
import PunchDown from "./PunchDown";
import PunchUp from "./PunchUp";

export { PunchLeft, PunchRight, PunchDown, PunchUp }