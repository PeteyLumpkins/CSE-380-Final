import AABB from "../../../../../Wolfie2D/DataTypes/Shapes/AABB"
import { PlayerStates } from "../../PlayerController";
import Punch from "./Punch";

export default class PunchRight extends Punch {

    public static readonly animationKey = "PUNCH_RIGHT"

    onEnter(options: Record<string, any>): void {
        this.animation = PunchRight.animationKey;
        super.onEnter(options);
    }

    idle(): void {
        this.finished(PlayerStates.IDLE_RIGHT);
    }

    getHitbox(): AABB {
        return this.parent.getRightHitbox();
    }

    takeDamage(): void {
        this.finished(PlayerStates.HURT_RIGHT);
    }
}