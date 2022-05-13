import AABB from "../../../../../Wolfie2D/DataTypes/Shapes/AABB";
import { PlayerStates } from "../../PlayerController";
import Punch from "./Punch";

export default class PunchDown extends Punch {

    public static readonly animationKey = "PUNCH_DOWN";

    onEnter(options: Record<string, any>): void {
        this.animation = PunchDown.animationKey;
        super.onEnter(options);
    }

    idle(): void {
        this.finished(PlayerStates.IDLE_DOWN);
    }

    getHitbox(): AABB {
        return this.parent.getDownHitbox();
    }

    takeDamage(): void {
        this.finished(PlayerStates.HURT_DOWN);
    }
}