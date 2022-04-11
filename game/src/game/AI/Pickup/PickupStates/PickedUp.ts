import State from "../../../../Wolfie2D/DataTypes/State/State";
import PickupState from "./PickupState";
import { GameEvents } from "../../../GameEnums";

export default class PickedUp extends PickupState {

    onEnter(): void {
        this.owner.tweens.play("pickup");
        this.emitter.fireEvent(GameEvents.PICKUP_ITEM, this.parent.getData());
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