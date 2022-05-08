import GameEvent from "../../../../../Wolfie2D/Events/GameEvent";
import { GameLayers, GameSprites } from "../../../../GameEnums";
import PickupAI from "../../../Pickup/PickupAI";
import { PickupTypes } from "../../../Pickup/PickupTypes";
import GooseState from "./GooseState";

export default class GooseDead extends GooseState {
    
    onEnter(options: Record<string, any>): void {
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

        /** Destroys the rat */
        this.owner.destroy();
    }

    handleInput(event: GameEvent): void {}
    
    onExit(): Record<string, any> { return; }
    
}