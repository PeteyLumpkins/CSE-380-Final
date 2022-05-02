import GameLevel from "../GameLevel";
import AABB from "../../../Wolfie2D/DataTypes/Shapes/AABB";
import OrthogonalTilemap from "../../../Wolfie2D/Nodes/Tilemaps/OrthogonalTilemap";
import AnimatedSprite from "../../../Wolfie2D/Nodes/Sprites/AnimatedSprite";
import StoreController from "../../AI/Store/StoreController";
import PlayerController from "../../AI/Player/PlayerController";
import { GameSprites, GameData, ItemSprites, GameLayers } from "../../GameEnums";
import Vec2 from "../../../Wolfie2D/DataTypes/Vec2";
import PositionGraph from "../../../Wolfie2D/DataTypes/Graphs/PositionGraph";

import PlayerStats from "../../AI/Player/PlayerStats";
import PlayerInventory from "../../AI/Player/PlayerInventory";
import StoreItems from "../../AI/Store/StoreItems";


import items from "./items.json";
export default class Level2 extends GameLevel {


    //! Current Positions:
    // Player Spawn = (416, 416)
    // Store Terminal = (832, 224)
    // Level End = (2944, 1568)

    protected walls: OrthogonalTilemap;
    protected navmeshGraph: PositionGraph;

    private PLAYER_SPAWN: Vec2 = new Vec2(448, 480);

    loadScene(): void {
        this.load.tilemap("level", "assets/tilemaps/levelTwo.json");


        // this.load.object(GameData.NAVMESH, "assets/data/navmeshLevel2.json"); 
        // this.load.object(GameData.STORE_ITEMS, "assets/data/item-data.json");
        // this.load.object("enemyData", "assets/data/enemyLevel2.json");
        this.load.spritesheet("player", "assets/spritesheets/player/player.json");
        this.load.spritesheet(GameSprites.STORE_BG, "assets/spritesheets/store/store_layer.json");

        this.load.image(GameSprites.LADDER, "assets/sprites/EndOfLevel.png");

    }

    startScene(): void {
        this.addLayer(GameLayers.PRIMARY, 5);

        super.startScene();
    }

    initPlayer(): void {
        let scale = this.viewport.getZoomLevel();
        let scalar = new Vec2(scale, scale);

        this.player = this.add.animatedSprite("player", GameLayers.PRIMARY);
		this.player.position.set(416, 416);
		let playerCollider = new AABB(Vec2.ZERO, new Vec2(this.player.sizeWithZoom.x, this.player.sizeWithZoom.y).div(scalar).div(new Vec2(3, 3)));
        this.player.addPhysics();
		this.player.setCollisionShape(playerCollider);

        let inventory = new Array<string>();

        let stats = {"HEALTH": 20, "MONEY": 10, "MOVE_SPEED": 4};
		this.player.addAI(PlayerController, {inventory: new PlayerInventory(inventory, 9), stats: new PlayerStats(stats)});
        this.viewport.follow(this.player);

    }

    initEnemies(): void {}

    initStore(): void {
        // let items = new StoreItems(
        //     [
        //         {key: "moldy_bread", count: 1},
        //         {key: "old_boot", count: 1},
        //         {key: "mystery_liquid", count: 1}
        //     ]
        // );

        // this.store = this.add.animatedSprite("store_terminal", GameLayers.PRIMARY);
        // this.store.position.set(832, 224);
        // this.store.scale.set(0.4, 0.4);
        // this.store.addAI(StoreController, {radius: 100, target: this.player, items: items});
    }

    initMap(): void {
        let tilemapLayers = this.add.tilemap("level");

        this.getTilemap("Floor").getLayer().setDepth(1);
        this.getTilemap("UpperWall").getLayer().setDepth(1);

         // Get the wall layer
        this.walls = <OrthogonalTilemap>tilemapLayers[0].getItems()[0];

        // Set the viewport bounds to the tilemap
        let tilemapSize: Vec2 = this.walls.size;

        this.viewport.setBounds(0, 0, tilemapSize.x, tilemapSize.y);
    }

    initLevelLinks(): void {}

    initViewport(): void {
        this.viewport.setZoomLevel(1);
    }


}