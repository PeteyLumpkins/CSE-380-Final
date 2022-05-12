import AABB from "../../../../../Wolfie2D/DataTypes/Shapes/AABB";
import { PlayerStates } from "../../PlayerController";
import Punch from "./Punch";

export default class PunchLeft extends Punch {

    public static readonly animationKey = "PUNCH_LEFT"

    onEnter(options: Record<string, any>): void {
        this.animation = PunchLeft.animationKey;
        super.onEnter(options);
    }

    idle(): void {
        this.finished(PlayerStates.IDLE_LEFT);
    }

    getHitbox(): AABB {
        return this.parent.getLeftHitbox();
    }
}