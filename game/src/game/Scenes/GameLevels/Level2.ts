import GameLevel from "../GameLevel";
import Level3 from "./Level3";

import AABB from "../../../Wolfie2D/DataTypes/Shapes/AABB";
import OrthogonalTilemap from "../../../Wolfie2D/Nodes/Tilemaps/OrthogonalTilemap";
import LevelEndAI from "../../AI/LevelEnd/LevelEndAI";
import PlayerController from "../../AI/Player/PlayerController";
import { GameSprites, GameData, ItemSprites, GameLayers } from "../../GameEnums";
import Vec2 from "../../../Wolfie2D/DataTypes/Vec2";
import PositionGraph from "../../../Wolfie2D/DataTypes/Graphs/PositionGraph";

import Shop from "../GameLevels/Shop";
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

        for (let i = 0; i < items.length; i++) {
            this.load.image(items[i].key, items[i].path);
        }

        // this.load.object(GameData.NAVMESH, "assets/data/navmeshLevel2.json"); 
        // this.load.object(GameData.STORE_ITEMS, "assets/data/item-data.json");
        // this.load.object("enemyData", "assets/data/enemyLevel2.json");
        this.load.spritesheet("player", "assets/spritesheets/player/player.json");
        this.load.spritesheet(GameSprites.STORE_BG, "assets/spritesheets/store/store_layer.json");

        this.load.image(GameSprites.LADDER, "assets/sprites/EndOfLevel.png");
    }

    initScene(init: Record<string, any>): void {
        this.playerSpawn = init.spawn !== undefined ? init.spawn : Vec2.ZERO;
        this.startingItems = init.inventory !== undefined ? init.inventory.getCopy() : [];
        this.startingStats = init.stats !== undefined ? init.stats.getCopy() : {};
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

		this.player.addAI(PlayerController, {inventory: new PlayerInventory(this.startingItems, 9), stats: new PlayerStats(this.startingStats)});
        this.viewport.follow(this.player);
    }

    initEnemies(): void {}

    initStore(): void {
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

    initLevelLinks(): void {
        // SHOP LEVEL
        this.shop = this.add.sprite(GameSprites.LADDER, GameLayers.PRIMARY);
        this.shop.position.set(832, 224);
        this.shop.addAI(LevelEndAI, {player: this.player, range: 25, nextLevel: Shop, nextLevelData: {
            spawn: new Vec2(160, 352), 
            inventory: (<PlayerController>this.player._ai).playerInventory,
            stats: (<PlayerController>this.player._ai).playerStats,
            nextLevel: Level2,
        }});

        // NEXT LEVEL
        this.nextLevel = this.add.sprite(GameSprites.LADDER, GameLayers.PRIMARY);
        this.nextLevel.position.set(2944, 1568);
        this.nextLevel.addAI(LevelEndAI, {player: this.player, range: 25, nextLevel: Level3, nextLevelData: {
            spawn: new Vec2(448, 480), 
            inventory: (<PlayerController>this.player._ai).playerInventory,
            stats: (<PlayerController>this.player._ai).playerStats
        }});
    }

    initViewport(): void {
        this.viewport.setZoomLevel(1);
    }


}