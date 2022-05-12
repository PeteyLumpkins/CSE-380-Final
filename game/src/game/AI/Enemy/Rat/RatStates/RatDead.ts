import GameEvent from "../../../../../Wolfie2D/Events/GameEvent";
import RandUtils from "../../../../../Wolfie2D/Utils/RandUtils";
import PickupAI from "../../../Pickup/PickupAI";
import { PickupTypes } from "../../../Pickup/PickupTypes";
import { GameSprites, GameLayers } from "../../../../GameEnums";

import RatState from "./RatState";

export default class RatDead extends RatState {

    public static readonly ANIMATION = "";

    onEnter(options: Record<string, any>): void {
        console.log("STARTED RAT DEATH");

        let drop = RandUtils.randInt(0, 3);

        switch(drop) {

            // Drop a coin
            case 1: {
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
                break;
            }

            // Drop a healthpack
            case 2: {
                let healthpack = this.owner.getScene().add.sprite("healthpickup", GameLayers.PRIMARY);
                healthpack.position.set(this.owner.position.x, this.owner.position.y);
                healthpack.addAI(PickupAI, {
                    canPickup: () => {
                        return this.parent.target.position.distanceTo(healthpack.position) <= 50;
                    }, 
                    pickup: () => {
                        return this.parent.target.position.distanceTo(healthpack.position) <= 50;
                    },
                    data: {type: PickupTypes.HEALTH, amount: 4}
                })
                break;
            }

            // Drop nothing
            default: {
                break;
            }
        }
        
        /** Destroys the rat */
        this.owner.destroy();
    }

    handleInput(event: GameEvent): void {
        switch(event.type) {

        }
    }

    takeDamage(): void {}

    update(deltaT: number): void {}

    onExit(): Record<string, any> {
        return;
    }

}