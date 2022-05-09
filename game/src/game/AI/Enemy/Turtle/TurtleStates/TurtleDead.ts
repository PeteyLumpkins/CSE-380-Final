import GameEvent from "../../../../../Wolfie2D/Events/GameEvent";

import PickupAI from "../../../Pickup/PickupAI";
import { PickupTypes } from "../../../Pickup/PickupTypes";
import { GameSprites, GameLayers } from "../../../../GameEnums";

import TurtleState from "./TurtleState";

export default class TurtleDead extends TurtleState {

    onEnter(options: Record<string, any>): void {
        console.log("STARTED Turtle DEATH");

        /** Should drop a coin wherever the Turtle dies hopefully */
        let coin = this.owner.getScene().add.animatedSprite(GameSprites.COIN, GameLayers.PRIMARY);
        coin.position.set(this.owner.position.x, this.owner.position.y);
        coin.addAI(PickupAI, {
            canPickup: () => {
                return this.parent.target.position.distanceTo(coin.position) <= 50;
            },
            pickup: () => {
                return this.parent.target.position.distanceTo(coin.position) <= 50;
            },
            data: {type: PickupTypes.MONEY, amount: 1}
        });

        /** Destroys the Turtle */
        this.owner.destroy();
    }

    handleInput(event: GameEvent): void {
    }

    update(deltaT: number): void {}

    onExit(): Record<string, any> {
        return;
    }

}