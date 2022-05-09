import AABB from "../../../Wolfie2D/DataTypes/Shapes/AABB";
import OrthogonalTilemap from "../../../Wolfie2D/Nodes/Tilemaps/OrthogonalTilemap";
import PlayerController from "../../AI/Player/PlayerController";
import AnimatedSprite from "../../../Wolfie2D/Nodes/Sprites/AnimatedSprite";
import { GameSprites, GameData, GameLayers } from "../../GameEnums";
import Vec2 from "../../../Wolfie2D/DataTypes/Vec2";
import PositionGraph from "../../../Wolfie2D/DataTypes/Graphs/PositionGraph";
import Navmesh from "../../../Wolfie2D/Pathfinding/Navmesh";
import { GraphicType } from "../../../Wolfie2D/Nodes/Graphics/GraphicTypes";

import { RatAIOptionType } from "../../AI/Enemy/Rat/RatAI";
import RatAI from "../../AI/Enemy/Rat/RatAI";
import { TurtleAIOptionType } from "../../AI/Enemy/Turtle/TurtleAI";
import TurtleAI from "../../AI/Enemy/Turtle/TurtleAI";


import GameLevel from "./GameLevel";
import LevelEndAI from "../../AI/LevelEnd/LevelEndAI";

import PlayerStats from "../../AI/Player/PlayerStats";
import PlayerInventory from "../../AI/Player/PlayerInventory";
import Shop from "./Shop";
import Level5 from "./Level5";
import DemonGooseAI from "../../AI/Enemy/Goose/DemonGooseAI";
import { GameEventType } from "../../../Wolfie2D/Events/GameEventType";

export default class Level4 extends GameLevel {

    public static readonly PLAYER_SPAWN_POS = new Vec2(213, 1681);
    public static readonly STORE_LEVEL_POS = new Vec2(1553, 334);
    public static readonly NEXT_LEVEL_POS = new Vec2(412, 525);

    protected walls: OrthogonalTilemap;
    protected navmeshGraph: PositionGraph;

    initScene(init: Record<string, any>): void {
        this.playerSpawn = init.spawn !== undefined ? init.spawn : Level4.PLAYER_SPAWN_POS;
        this.startingItems = init.inventory !== undefined ? init.inventory.getCopy() : [];
        this.startingStats = init.stats !== undefined ? init.stats.getCopy() : {};
    }

    loadScene(): void {
        super.loadScene();

        this.load.tilemap("level", "assets/tilemaps/Level32.json");
        this.load.object(GameData.NAVMESH, "assets/data/navmeshLevel32.json");
        this.load.object("enemyData", "assets/data/enemyLevel32.json");
        this.load.audio("level3", "assets/music/Level3.wav");

    }

    unloadScene(): void {
        this.emitter.fireEvent(GameEventType.STOP_SOUND, {key: "level3"});
        super.unloadScene();
    }

    startScene(): void {
        this.addLayer(GameLayers.PRIMARY, 5);
        super.startScene();
        this.emitter.fireEvent(GameEventType.PLAY_SOUND, {key: "level3", loop: true, holdReference: true});

    }

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
        this.getTilemap("Floor").getLayer().setDepth(1);
        this.getTilemap("UpperWall").getLayer().setDepth(1);
        
         // Get the wall layer
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
        this.shop = this.add.sprite(GameSprites.LADDER, GameLayers.PRIMARY);
        this.shop.position.copy(Level4.STORE_LEVEL_POS);
        this.shop.addAI(LevelEndAI, {player: this.player, range: 25, nextLevel: Shop, nextLevelData: {
            spawn: Shop.PLAYER_SPAWN_POS, 
            inventory: (<PlayerController>this.player._ai).playerInventory,
            stats: (<PlayerController>this.player._ai).playerStats,

            nextLevel: Level4,
            nextLevelSpawn: Level4.STORE_LEVEL_POS
        }});

        this.nextLevel = this.add.sprite(GameSprites.LADDER, GameLayers.PRIMARY);
        this.nextLevel.position.copy(Level4.NEXT_LEVEL_POS);
        this.nextLevel.addAI(LevelEndAI, {player: this.player, range: 25, nextLevel: Level5, nextLevelData: {
            spawn: Level5.PLAYER_SPAWN_POS, 
            inventory: (<PlayerController>this.player._ai).playerInventory,
            stats: (<PlayerController>this.player._ai).playerStats
        }});
    }

    initEnemies(): void {
        this.enemies = new Array<AnimatedSprite>();
        let enemyData = this.load.getObject("enemyData");
        
        let options = RatAI.optionsBuilder(RatAIOptionType.FAST, this.player);
        let turtleOptions=TurtleAI.optionsBuilder(TurtleAIOptionType.DEFAULT, this.player);
        let gooseOptions = {
            target: this.player,
            health: 5,
            sightRange: 200,
            moveSpeed: 100,
            attackRange: 75, 
            attackDamage: 1
        }

        let scale = this.viewport.getZoomLevel();
        let scalar = new Vec2(1/scale, 1/scale).mult(new Vec2(2, 2));

        for (let i = 0; i < enemyData.enemies.length; i++) {
            let type = enemyData.enemies[i].type;
            switch(type) {
                case "rat": {
                    this.enemies[i] = this.add.animatedSprite("rat", GameLayers.PRIMARY);
                    this.enemies[i].addAI(RatAI, options);
                    break;
                }
                case "turtle": {
                    this.enemies[i]=this.add.animatedSprite("turtle", GameLayers.PRIMARY);
                    this.enemies[i].addAI(TurtleAI, turtleOptions);
                    break;
                }
                case "goose":{
                    this.enemies[i] = this.add.animatedSprite("goose", GameLayers.PRIMARY);
                    this.enemies[i].scale.mult(scalar);
                    this.enemies[i].addAI(DemonGooseAI, gooseOptions);
                    this.enemies[i].setCollisionShape(new AABB(Vec2.ZERO, new Vec2(this.enemies[i].sizeWithZoom.x, this.enemies[i].sizeWithZoom.y).mult(scalar).div(new Vec2(3, 2))));
                }
            }
            this.enemies[i].position.set(enemyData.enemies[i].position[0], enemyData.enemies[i].position[1]);
            this.enemies[i].addPhysics();
        }
    }

}