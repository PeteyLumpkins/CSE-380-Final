import AABB from "../../../Wolfie2D/DataTypes/Shapes/AABB";
import Vec2 from "../../../Wolfie2D/DataTypes/Vec2";
import OrthogonalTilemap from "../../../Wolfie2D/Nodes/Tilemaps/OrthogonalTilemap";

import GameLevel from "../GameLevel";

import GameNode from "../../../Wolfie2D/Nodes/GameNode";
import AnimatedSprite from "../../../Wolfie2D/Nodes/Sprites/AnimatedSprite";
import PlayerController from "../../AI/Player/PlayerController";
import StoreController from "../../AI/Store/StoreController";
import PickupAI from "../../AI/Pickup/PickupAI";

import Attack from "../../Ai/Enemy/EnemyActions/Attack";
import LevelEndAI from "../../AI/LevelEnd/LevelEndAI";

import {GameSprites, GameData, GameLayers, ItemSprites } from "../../GameEnums";
import { PickupTypes } from "../../AI/Pickup/PickupTypes";


export default class Level1 extends GameLevel {

    private PLAYER_SPAWN: Vec2 = new Vec2(240, 256);
    private coin: AnimatedSprite;

    loadScene(){
        this.load.tilemap("level", "assets/tilemaps/prototypeMap.json");
        this.load.spritesheet(GameSprites.PLAYER, "assets/spritesheets/player.json");
        this.load.spritesheet(GameSprites.STORE, "assets/spritesheets/store_terminal.json");
        this.load.spritesheet(GameSprites.STORE_BG, "assets/spritesheets/store_layer.json");
        this.load.object(GameData.NAVMESH, "assets/data/navmesh.json");
        this.load.spritesheet(GameSprites.COIN, "assets/spritesheets/coin.json");

        this.load.object(GameData.STORE_ITEMS, "assets/data/items.json");
        this.load.image(ItemSprites.MOLD_BREAD, "assets/itemsprites/moldBread.png");
        this.load.image(ItemSprites.OLD_BOOT, "assets/itemsprites/oldBoot.png");
        this.load.image("endlevel", "assets/sprites/EndOfLevel.png");
    }

    /**
     * The "Scene" class has an options parameter that we'll use to pass the players
     * health and buffs through the game levels.
     */
    startScene(){

        //Uncomment this code and comment the above code when you're using your tilemap
        let tilemapLayers = this.add.tilemap("level");

        // FIXME: the player should be able to move under the pipes but for some reason it doesn't work,
        // I'm not sure what's up with the layering.
        this.getTilemap("Floor").getLayer().setDepth(4);
        this.getTilemap("Wall").getLayer().setDepth(6);

         // Get the wall layer
        this.walls = <OrthogonalTilemap>tilemapLayers[1].getItems()[0];

        // Set the viewport bounds to the tilemap
        let tilemapSize: Vec2 = this.walls.size;

        this.viewport.setBounds(0, 0, tilemapSize.x, tilemapSize.y);

        /* Set player spawn and scale for the level */
        this.playerScale = new Vec2(.75, .75);
        this.playerSpawn = new Vec2(240, 256);

        super.startScene();

        this.coin = this.add.animatedSprite(GameSprites.COIN, GameLayers.PRIMARY);
        this.coin.position.set(this.viewport.getCenter().clone().x , this.viewport.getCenter().clone().y - 32*2);
        this.coin.addAI(PickupAI, {range: 25, player: this.player, data: {type: PickupTypes.MONEY, amount: 1}});

        this.nextLevel = this.add.sprite("endlevel", GameLayers.PRIMARY)
        this.nextLevel.position.set(this.viewport.getCenter().clone().x + 275 , this.viewport.getCenter().clone().y);
        this.nextLevel.addAI(LevelEndAI, {range: 25, player: this.player, nextLevel: Level1});
    }

}