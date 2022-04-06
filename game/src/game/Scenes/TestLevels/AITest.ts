import AABB from "../../../Wolfie2D/DataTypes/Shapes/AABB";
import Vec2 from "../../../Wolfie2D/DataTypes/Vec2";
import OrthogonalTilemap from "../../../Wolfie2D/Nodes/Tilemaps/OrthogonalTilemap";

import GameLevel from "../GameLevel";

import PlayerController from "../../AI/Player/PlayerController";
import StoreController from "../../AI/Store/StoreController";

import {GameSprites, GameData, GameLayers } from "../../GameEnums";
import Input from "../../../Wolfie2D/Input/Input";

export default class AITest extends GameLevel {


    loadScene(){
        this.load.tilemap("level", "assets/tilemaps/MyMap.json");
        this.load.spritesheet(GameSprites.PLAYER, "assets/spritesheets/player.json");
        this.load.spritesheet("store_terminal", "assets/spritesheets/store_terminal.json");
        this.load.spritesheet(GameSprites.STORE_BG, "assets/spritesheets/store_layer.json");

        this.load.object(GameData.NAVMESH, "assets/data/navmesh.json");
    }

    /**
     * The "Scene" class has an options parameter that we'll use to pass the players
     * health and buffs through the game levels.
     */
    startScene(){
        let tilemapLayers = this.add.tilemap("level");

        this.getTilemap("Floor").getLayer().setDepth(4);
        this.getTilemap("Wall").getLayer().setDepth(6);

         // Get the wall layer
        this.walls = <OrthogonalTilemap>tilemapLayers[1].getItems()[0];

        // Set the viewport bounds to the tilemap
        let tilemapSize: Vec2 = this.walls.size;

        this.viewport.setBounds(0, 0, tilemapSize.x, tilemapSize.y);

        this.playerScale = new Vec2(.75, .75);
        this.playerSpawn = new Vec2(256, 240);

        super.startScene();
    }

    updateScene(deltaT: number): void {
        super.updateScene(deltaT);
    }

}