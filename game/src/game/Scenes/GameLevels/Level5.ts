import AABB from "../../../Wolfie2D/DataTypes/Shapes/AABB";
import OrthogonalTilemap from "../../../Wolfie2D/Nodes/Tilemaps/OrthogonalTilemap";
import PlayerController from "../../AI/Player/PlayerController";
import { GameSprites, GameData, GameLayers } from "../../GameEnums";
import Vec2 from "../../../Wolfie2D/DataTypes/Vec2";
import PositionGraph from "../../../Wolfie2D/DataTypes/Graphs/PositionGraph";
import Navmesh from "../../../Wolfie2D/Pathfinding/Navmesh";
import { GraphicType } from "../../../Wolfie2D/Nodes/Graphics/GraphicTypes";
import { GameEventType } from "../../../Wolfie2D/Events/GameEventType";


import LevelEndAI from "../../AI/LevelEnd/LevelEndAI";
import GameOver from "../GameOver";
import GameLevel from "./GameLevel";

import PlayerStats from "../../AI/Player/PlayerStats";
import PlayerInventory from "../../AI/Player/PlayerInventory";

export default class Level5 extends GameLevel {

    public static readonly PLAYER_SPAWN_POS = new Vec2(896, 1824);
    protected walls: OrthogonalTilemap;
    // public static readonly STORE_LEVEL_POS = new Vec2(0, 0);
    // public static readonly NEXT_LEVEL_POS = new Vec2(0, 0);

    /** SCENE METHODS */

    initScene(init: Record<string, any>): void {
        this.playerSpawn = init.spawn !== undefined ? init.spawn : Level5.PLAYER_SPAWN_POS;
        this.startingItems = init.inventory !== undefined ? init.inventory.getCopy() : [];
        this.startingStats = init.stats !== undefined ? init.stats.getCopy() : {};
    }

    loadScene(): void {
        super.loadScene();
        this.load.tilemap("level", "assets/tilemaps/LevelFive.json");
        this.load.audio("level5", "assets/music/Level5.wav");

        /** TODO: Load level stuff here */
    }

    unloadScene(): void {
        super.unloadScene();
        this.emitter.fireEvent(GameEventType.STOP_SOUND, {key: "level5"});

    }

    startScene(): void {
        this.addLayer(GameLayers.PRIMARY, 5);
        super.startScene();
        this.emitter.fireEvent(GameEventType.PLAY_SOUND, {key: "level5", loop: true, holdReference: true});

    }

    /** GAMELEVEL METHODS */

    initViewport(): void {
        this.viewport.setZoomLevel(3);
    }

    initPlayer(): void {
        let scale = this.viewport.getZoomLevel();
        let scalar = new Vec2(scale, scale);

        this.player = this.add.animatedSprite("player", GameLayers.PRIMARY);
		this.player.position.set(this.playerSpawn.x, this.playerSpawn.y);     
		let playerCollider = new AABB(Vec2.ZERO, new Vec2(this.player.sizeWithZoom.x, this.player.sizeWithZoom.y).div(scalar).div(new Vec2(2, 2)));
        this.player.addPhysics();
		this.player.setCollisionShape(playerCollider);

		this.player.addAI(PlayerController, {
            inventory: new PlayerInventory(this.startingItems, 9),                             
            stats: new PlayerStats(this.startingStats) 
        });  

        this.viewport.follow(this.player);
    }

    initStore(): void {}

    initMap(): void {
        let tilemapLayers = this.add.tilemap("level");
        
        // this.getTilemap("LowerWall").getLayer().setDepth(6);
        this.getTilemap("GroundProps").getLayer().setDepth(0);
        this.getTilemap("Floor").getLayer().setDepth(1);
        this.getTilemap("UpperWall").getLayer().setDepth(1);
        this.getTilemap("Arch").getLayer().setDepth(6);
        


         // Get the wall layer
        this.walls = <OrthogonalTilemap>tilemapLayers[0].getItems()[0];

        // Set the viewport bounds to the tilemap
        let tilemapSize: Vec2 = this.walls.size;

        this.viewport.setBounds(0, 0, tilemapSize.x, tilemapSize.y);

        let gLayer = this.addLayer(GameLayers.NAVMESH_GRAPH, 10);
        gLayer.setHidden(true);
    }

    initLevelLinks(): void {

    }

    initEnemies(): void {

    }
    
}