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
import AnimatedSprite from "../../../Wolfie2D/Nodes/Sprites/AnimatedSprite";
import RatAI, { RatAIOptionType } from "../../AI/Enemy/Rat/RatAI";
import { GraphicType } from "../../../Wolfie2D/Nodes/Graphics/GraphicTypes";
import Navmesh from "../../../Wolfie2D/Pathfinding/Navmesh";
import { GameEventType } from "../../../Wolfie2D/Events/GameEventType";
import NormalGooseAI from "../../AI/Enemy/Goose/NormalGooseAI";
import DemonGooseAI from "../../AI/Enemy/Goose/DemonGooseAI";

export default class Level2 extends GameLevel {

    public static readonly PLAYER_SPAWN_POS = new Vec2(254, 382);
    public static readonly STORE_LEVEL_POS = new Vec2(1784, 160);
    public static readonly NEXT_LEVEL_POS = new Vec2(184, 1442);

    protected walls: OrthogonalTilemap;
    protected navmeshGraph: PositionGraph;

    loadScene(): void {
        super.loadScene();
        this.load.tilemap("level", "assets/tilemaps/level1.2.json");
        this.load.object("enemyData", "assets/data/enemyLevel1.2.json");
        this.load.object(GameData.NAVMESH, "assets/data/navmeshLevel1.2.json"); 
        this.load.audio("level1", "assets/music/Level1.wav");
    }

    unloadScene(): void {
        super.unloadScene();
        this.emitter.fireEvent(GameEventType.STOP_SOUND, {key: "level1"});

    }

    initScene(init: Record<string, any>): void {
        this.playerSpawn = init.spawn !== undefined ? init.spawn : Level2.PLAYER_SPAWN_POS;
        this.startingItems = init.inventory !== undefined ? init.inventory.getCopy() : [];
        this.startingStats = init.stats !== undefined ? init.stats.getCopy() : {};
    }

    startScene(): void {
        this.addLayer(GameLayers.PRIMARY, 5);
        super.startScene();
        this.emitter.fireEvent(GameEventType.PLAY_SOUND, {key: "level1", loop: true, holdReference: true});
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

    initEnemies(): void {
        this.enemies = new Array<AnimatedSprite>();
        let enemyData = this.load.getObject("enemyData");
        let options = RatAI.optionsBuilder(RatAIOptionType.FAST, this.player);
        let gooseOptions = { 
            target: this.player,
            health: 5,
            sightRange: 200,
            moveSpeed: 100,
            attackRange: 75, 
            attackDamage: 3
        }

        let scale = this.viewport.getZoomLevel();
        let scalar = new Vec2(1/scale, 1/scale);

        for (let i = 0; i < enemyData.enemies.length; i++) {
            let type = enemyData.enemies[i].type;
            switch(type) {
                case "normal_goose": {
                    this.enemies[i] = this.add.animatedSprite("normal_goose", GameLayers.PRIMARY);
                    this.enemies[i].scale.mult(scalar);
                    this.enemies[i].addAI(NormalGooseAI, gooseOptions);
                    break;
                } 
                case "demon_goose": {
                    this.enemies[i] = this.add.animatedSprite("goose", GameLayers.PRIMARY);
                    this.enemies[i].addAI(DemonGooseAI, gooseOptions);
                    break;
                }
                default: {
                    this.enemies[i] = this.add.animatedSprite("whiteRat", GameLayers.PRIMARY);
                    this.enemies[i].addAI(RatAI, options);
                    break;
                }
            }
            this.enemies[i].position.set(enemyData.enemies[i].position[0], enemyData.enemies[i].position[1]);
            this.enemies[i].addPhysics();
        }
    }

    initStore(): void {
    }

    initMap(): void {
        let tilemapLayers = this.add.tilemap("level");

        this.getTilemap("Floor").getLayer().setDepth(1);
        this.getTilemap("UpperWall").getLayer().setDepth(1);
        this.getTilemap("UpperWallPipes").getLayer().setDepth(6);
        this.getTilemap("GroundProps").getLayer().setDepth(0);

        this.walls = <OrthogonalTilemap>tilemapLayers[0].getItems()[0];

        // Set the viewport bounds to the tilemap
        let tilemapSize: Vec2 = this.walls.size;

        this.viewport.setBounds(0, 0, tilemapSize.x, tilemapSize.y);

        let gLayer = this.addLayer(GameLayers.NAVMESH_GRAPH, 10);
        gLayer.setHidden(true);

        let navmeshData = this.load.getObject(GameData.NAVMESH);

         // Create the graph
        this.navmeshGraph = new PositionGraph();

        // Add all nodes to our graph
        for(let node of navmeshData.nodes){
            this.navmeshGraph.addPositionedNode(new Vec2(node[0], node[1]));
            this.add.graphic(GraphicType.POINT, GameLayers.NAVMESH_GRAPH, {position: new Vec2(node[0], node[1])});
        }

        // Add all edges to our graph
        for(let edge of navmeshData.edges){
            this.navmeshGraph.addEdge(edge[0], edge[1]);
            this.add.graphic(GraphicType.LINE, GameLayers.NAVMESH_GRAPH, {start: this.navmeshGraph.getNodePosition(edge[0]), end: this.navmeshGraph.getNodePosition(edge[1])})
        }

        // Set this graph as a navigable entity
        let navmesh = new Navmesh(this.navmeshGraph);

        this.navManager.addNavigableEntity("navmesh", navmesh);
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