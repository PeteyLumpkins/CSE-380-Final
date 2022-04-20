import Vec2 from "../../../../../Wolfie2D/DataTypes/Vec2";
import { PlayerStates } from "../../PlayerController";
import PlayerState from "../PlayerState";

export default abstract class Punch extends PlayerState {

    onEnter(options: Record<string, any> ): void {
        this.attackTimer.start(880*2);
    }

    update(deltaT: number): void {
        super.update(deltaT);

        let dir = this.getInputDirection();
        let attacking = this.isAttacking();

        if (attacking) {
            this.attack(dir);
        } else if (dir.isZero()) {
            this.idle();
        } else {
            this.move(dir);
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

    abstract attack(dir: Vec2): void;

}