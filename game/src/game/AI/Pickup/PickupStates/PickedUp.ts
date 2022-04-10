import State from "../../../../Wolfie2D/DataTypes/State/State";
import PickupState from "./PickupState";

export default class PickedUp extends PickupState {

    onEnter(): void {
        this.owner.tweens.play("pickup");
        this.parent.destroy();
    }

    handleInput(): void {

    }

    update(deltaT: number): void {

    }

    onExit(): Record<string, any> {
        return {};
    }


}