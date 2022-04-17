import AABB from "../../../../../Wolfie2D/DataTypes/Shapes/AABB";
import Vec2 from "../../../../../Wolfie2D/DataTypes/Vec2";
import GameEvent from "../../../../../Wolfie2D/Events/GameEvent";
import AnimatedSprite from "../../../../../Wolfie2D/Nodes/Sprites/AnimatedSprite";

import PickupAI from "../../../Pickup/PickupAI";
import { PickupTypes } from "../../../Pickup/PickupTypes";
import { GameSprites, GameLayers } from "../../../../GameEnums";

import RatState from "./RatState";
import { RatAIStates, RatAIEvents } from "../RatAI";

export default class RatDead extends RatState {

    onEnter(options: Record<string, any>): void {
        console.log("STARTED RAT DEATH");

        /** Should drop a coin wherever the rat dies hopefully */
        let coin = this.owner.getScene().add.animatedSprite(GameSprites.COIN, "primary");
        coin.position.set(this.owner.position.x, this.owner.position.y);
        coin.addAI(PickupAI, {
            player: this.parent.player, 
            range: 25,
            data: {type: PickupTypes.MONEY, amount: 1}
        });

        console.log(this.owner.getScene().getLayer("primary").getItems())

        /** Destroys the rat */
        this.owner.destroy();
    }

    handleInput(event: GameEvent): void {
    }

    update(deltaT: number): void {}

    onExit(): Record<string, any> {
        return;
    }

}