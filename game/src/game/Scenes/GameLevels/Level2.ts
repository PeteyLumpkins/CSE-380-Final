import GameLevel from "./GameLevel";
import Level3 from "./Level3";

import AABB from "../../../Wolfie2D/DataTypes/Shapes/AABB";
import OrthogonalTilemap from "../../../Wolfie2D/Nodes/Tilemaps/OrthogonalTilemap";
import LevelEndAI from "../../AI/LevelEnd/LevelEndAI";
import PlayerController from "../../AI/Player/PlayerController";
import { GameSprites, GameData, GameLayers } from "../../GameEnums";
import Vec2 from "../../../Wolfie2D/DataTypes/Vec2";
import PositionGraph from "../../../Wolfie2D/DataTypes/Graphs/PositionGraph";

import Shop from "../GameLevels/Shop";
import PlayerStats from "../../AI/Player/PlayerStats";
import PlayerInventory from "../../AI/Player/PlayerInventory";

export default class Level2 extends GameLevel {

    public static readonly PLAYER_SPAWN_POS = new Vec2(254, 382);
    public static readonly STORE_LEVEL_POS = new Vec2(1784, 160);
    public static readonly NEXT_LEVEL_POS = new Vec2(184, 1442);

    protected walls: OrthogonalTilemap;
    protected navmeshGraph: PositionGraph;

    loadScene(): void {
        super.loadScene();
        this.load.tilemap("level", "assets/tilemaps/level1.2.json");
        // this.load.object(GameData.NAVMESH, "assets/data/navmeshLevel2.json"); 
    }

    unloadScene(): void {
        super.unloadScene();
    }

    initScene(init: Record<string, any>): void {
        this.playerSpawn = init.spawn !== undefined ? init.spawn : Level2.PLAYER_SPAWN_POS;
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
		this.player.position.set(this.playerSpawn.x, this.playerSpawn.y);
		let playerCollider = new AABB(Vec2.ZERO, new Vec2(this.player.sizeWithZoom.x, this.player.sizeWithZoom.y).div(scalar).div(new Vec2(2, 2)));
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
        this.getTilemap("UpperWallPipes").getLayer().setDepth(6);

         // Get the wall layer
        this.walls = <OrthogonalTilemap>tilemapLayers[0].getItems()[0];

        // Set the viewport bounds to the tilemap
        let tilemapSize: Vec2 = this.walls.size;

        this.viewport.setBounds(0, 0, tilemapSize.x, tilemapSize.y);
    }

    initLevelLinks(): void {

        // SHOP LEVEL
        this.shop = this.add.sprite(GameSprites.LADDER, GameLayers.PRIMARY);
        this.shop.position.copy(Level2.STORE_LEVEL_POS);
        this.shop.addAI(LevelEndAI, {player: this.player, range: 25, nextLevel: Shop, nextLevelData: {
            spawn: Shop.PLAYER_SPAWN_POS, 
            inventory: (<PlayerController>this.player._ai).playerInventory,
            stats: (<PlayerController>this.player._ai).playerStats,

            nextLevel: Level2,
            nextLevelSpawn: Level2.STORE_LEVEL_POS
        }});

        // NEXT LEVEL
        this.nextLevel = this.add.sprite(GameSprites.LADDER, GameLayers.PRIMARY);
        this.nextLevel.position.copy(Level2.NEXT_LEVEL_POS);
        this.nextLevel.addAI(LevelEndAI, {player: this.player, range: 25, nextLevel: Level3, nextLevelData: {
            spawn: Level3.PLAYER_SPAWN_POS, 
            inventory: (<PlayerController>this.player._ai).playerInventory,
            stats: (<PlayerController>this.player._ai).playerStats
        }});
    }

    initViewport(): void {
        this.viewport.setZoomLevel(3);
    }


}