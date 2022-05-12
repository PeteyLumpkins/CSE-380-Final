import AABB from "../../../../../Wolfie2D/DataTypes/Shapes/AABB";
import { PlayerStates } from "../../PlayerController";
import Punch from "./Punch";

export default class PunchUp extends Punch {

    public static readonly animationKey = "PUNCH_UP"

    onEnter(options: Record<string, any>): void {
        this.animation = PunchUp.animationKey;
        super.onEnter(options);
    }

    idle(): void {
        this.finished(PlayerStates.IDLE_UP);
    }

    getHitbox(): AABB {
        return this.parent.getUpHitbox();
    }
}