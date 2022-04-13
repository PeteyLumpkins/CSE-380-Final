import AABB from "../../../../Wolfie2D/DataTypes/Shapes/AABB";
import Vec2 from "../../../../Wolfie2D/DataTypes/Vec2";
import GameEvent from "../../../../Wolfie2D/Events/GameEvent";
import AnimatedSprite from "../../../../Wolfie2D/Nodes/Sprites/AnimatedSprite";

import PickupAI from "../../../AI/Pickup/PickupAI";
import { PickupTypes } from "../../../AI/Pickup/PickupTypes";
import { GameSprites, GameLayers } from "../../../GameEnums";

import RatState from "./RatState";
import { RatStates, RatEvents } from "./RatAI";

export default class RatDead extends RatState {

    onEnter(options: Record<string, any>): void {

        /** Should drop a coin wherever the rat dies hopefully */
        let coin = this.owner.getScene().add.animatedSprite(GameSprites.COIN, GameLayers.PRIMARY);
        coin.addAI(PickupAI, {
            player: this.parent.player, 
            range: 25,
            data: {type: PickupTypes.MONEY, amount: 1}
        });

        /** Destroys the rat */
        this.owner.destroy();
    }

    handleInput(event: GameEvent): void {}

    update(deltaT: number): void {}

    onExit(): Record<string, any> {
        return;
    }

}