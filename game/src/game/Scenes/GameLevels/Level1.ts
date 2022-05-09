import AABB from "../../../Wolfie2D/DataTypes/Shapes/AABB";
import OrthogonalTilemap from "../../../Wolfie2D/Nodes/Tilemaps/OrthogonalTilemap";
import AnimatedSprite from "../../../Wolfie2D/Nodes/Sprites/AnimatedSprite";
import PlayerController from "../../AI/Player/PlayerController";
import { GameSprites, GameData, GameLayers } from "../../GameEnums";
import Vec2 from "../../../Wolfie2D/DataTypes/Vec2";
import PositionGraph from "../../../Wolfie2D/DataTypes/Graphs/PositionGraph";
import Navmesh from "../../../Wolfie2D/Pathfinding/Navmesh";
import { GraphicType } from "../../../Wolfie2D/Nodes/Graphics/GraphicTypes";
import { GameEventType } from "../../../Wolfie2D/Events/GameEventType";
import { RatAIOptionType } from "../../AI/Enemy/Rat/RatAI";

import GameLevel from "./GameLevel";
import LevelEndAI from "../../AI/LevelEnd/LevelEndAI";

import RatAI from "../../AI/Enemy/Rat/RatAI";


import Level2 from "./Level2";

import PlayerStats from "../../AI/Player/PlayerStats";
import PlayerInventory from "../../AI/Player/PlayerInventory";
import Shop from "./Shop";


export default class Level1 extends GameLevel {

    public static readonly PLAYER_SPAWN_POS = new Vec2(160, 352);
    public static readonly STORE_LEVEL_POS = new Vec2(1056, 1200);
    public static readonly NEXT_LEVEL_POS = new Vec2(2960, 595);

    protected walls: OrthogonalTilemap;
    protected navmeshGraph: PositionGraph;


    /** SCENE METHODS */
    
    initScene(init: Record<string, any>): void {
        this.playerSpawn = init.spawn !== undefined ? init.spawn : Level1.PLAYER_SPAWN_POS;
        this.startingItems = init.inventory !== undefined ? init.inventory.getCopy() : [];
        this.startingStats = init.stats !== undefined ? init.stats.getCopy() : {};
    }

    loadScene(){
        super.loadScene();

        this.load.tilemap("level", "assets/tilemaps/levelOne.json");
        this.load.object(GameData.NAVMESH, "assets/data/navmeshLevel1.json"); 
        this.load.object("enemyData", "assets/data/enemyLevel1.json");
        this.load.audio("level1", "assets/music/Level1.wav");
    }

    unloadScene(): void {
        super.unloadScene();
        this.emitter.fireEvent(GameEventType.STOP_SOUND, {key: "level1"});
    }

    startScene(){
        this.addLayer(GameLayers.PRIMARY, 5);
        
        let bgPipe = this.add.animatedSprite("brokenGreenPipe", GameLayers.PRIMARY);
        bgPipe.animation.play("idle", true);
        bgPipe.position.set(880, 432);

        super.startScene();
        this.emitter.fireEvent(GameEventType.PLAY_SOUND, {key: "level1", loop: true, holdReference: true});
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
            stats: new PlayerStats(this.startingStats) // Passed through here?
        });  

        this.viewport.follow(this.player);
    }

    initStore(): void {}

    initMap(): void {

        let tilemapLayers = this.add.tilemap("level");
        
        // this.getTilemap("LowerWall").getLayer().setDepth(6);
        this.getTilemap("Floor").getLayer().setDepth(1);
        this.getTilemap("PipeLayer1").getLayer().setDepth(6);
        this.getTilemap("UpperWall").getLayer().setDepth(1);
        this.getTilemap("GroundProps").getLayer().setDepth(1);

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

        // SHOP LEVEL
        this.shop = this.add.sprite(GameSprites.LADDER, GameLayers.PRIMARY);
        this.shop.position.copy(Level1.STORE_LEVEL_POS);
        this.shop.addAI(LevelEndAI, {player: this.player, range: 25, nextLevel: Shop, nextLevelData: {
            spawn: Shop.PLAYER_SPAWN_POS, 
            inventory: (<PlayerController>this.player._ai).playerInventory,
            stats: (<PlayerController>this.player._ai).playerStats,
            nextLevel: Level1,
            nextLevelSpawn: Level1.STORE_LEVEL_POS
        }});

        // NEXT LEVEL
        this.nextLevel = this.add.sprite(GameSprites.LADDER, GameLayers.PRIMARY);
        this.nextLevel.position.copy(Level1.NEXT_LEVEL_POS);
        this.nextLevel.addAI(LevelEndAI, {player: this.player, range: 25, nextLevel: Level2, nextLevelData: {
            spawn: Level2.PLAYER_SPAWN_POS, 
            inventory: (<PlayerController>this.player._ai).playerInventory,
            stats: (<PlayerController>this.player._ai).playerStats
        }});
    }

    initEnemies(): void {
        
        this.enemies = new Array<AnimatedSprite>();
        let enemyData = this.load.getObject("enemyData");
        let options = RatAI.optionsBuilder(RatAIOptionType.DEFAULT, this.player);

        for (let i = 0; i < enemyData.enemies.length; i++) {
            this.enemies[i] = this.add.animatedSprite("rat", GameLayers.PRIMARY);
            this.enemies[i].position.set(enemyData.enemies[i].position[0], enemyData.enemies[i].position[1]);
            this.enemies[i].addAI(RatAI, options);
            this.enemies[i].addPhysics();
        }
    }

    drawHitbox(): void {

        let scale = 1/2;

        let ry = this.player.position.y;
        let rx = this.player.boundary.topRight.x;

        let box = new AABB(new Vec2(rx, ry), new Vec2(this.player.boundary.halfSize.x * scale, this.player.boundary.halfSize.y * scale));

        this.add.graphic(GraphicType.LINE, GameLayers.NAVMESH_GRAPH, {start: box.topLeft, end: box.topRight});
        this.add.graphic(GraphicType.LINE, GameLayers.NAVMESH_GRAPH, {start: box.topRight, end: box.bottomRight});
        this.add.graphic(GraphicType.LINE, GameLayers.NAVMESH_GRAPH, {start: box.bottomRight, end: box.bottomLeft});
        this.add.graphic(GraphicType.LINE, GameLayers.NAVMESH_GRAPH, {start: box.bottomLeft, end: box.topLeft});



        let ly = this.player.position.y;
        let lx = this.player.boundary.topLeft.x;

        box = new AABB(new Vec2(lx, ly), new Vec2(this.player.boundary.halfSize.x * scale, this.player.boundary.halfSize.y * scale));

        this.add.graphic(GraphicType.LINE, GameLayers.NAVMESH_GRAPH, {start: box.topLeft, end: box.topRight});
        this.add.graphic(GraphicType.LINE, GameLayers.NAVMESH_GRAPH, {start: box.topRight, end: box.bottomRight});
        this.add.graphic(GraphicType.LINE, GameLayers.NAVMESH_GRAPH, {start: box.bottomRight, end: box.bottomLeft});
        this.add.graphic(GraphicType.LINE, GameLayers.NAVMESH_GRAPH, {start: box.bottomLeft, end: box.topLeft});



        let uy = this.player.boundary.topRight.y;
        let ux = this.player.position.x;

        box = new AABB(new Vec2(ux, uy), new Vec2(this.player.boundary.halfSize.x * scale, this.player.boundary.halfSize.y * scale));

        this.add.graphic(GraphicType.LINE, GameLayers.NAVMESH_GRAPH, {start: box.topLeft, end: box.topRight});
        this.add.graphic(GraphicType.LINE, GameLayers.NAVMESH_GRAPH, {start: box.topRight, end: box.bottomRight});
        this.add.graphic(GraphicType.LINE, GameLayers.NAVMESH_GRAPH, {start: box.bottomRight, end: box.bottomLeft});
        this.add.graphic(GraphicType.LINE, GameLayers.NAVMESH_GRAPH, {start: box.bottomLeft, end: box.topLeft});



        let dy = this.player.boundary.bottomRight.y;
        let dx = this.player.position.x;

        box = new AABB(new Vec2(dx, dy), new Vec2(this.player.boundary.halfSize.x * scale, this.player.boundary.halfSize.y * scale));

        this.add.graphic(GraphicType.LINE, GameLayers.NAVMESH_GRAPH, {start: box.topLeft, end: box.topRight});
        this.add.graphic(GraphicType.LINE, GameLayers.NAVMESH_GRAPH, {start: box.topRight, end: box.bottomRight});
        this.add.graphic(GraphicType.LINE, GameLayers.NAVMESH_GRAPH, {start: box.bottomRight, end: box.bottomLeft});
        this.add.graphic(GraphicType.LINE, GameLayers.NAVMESH_GRAPH, {start: box.bottomLeft, end: box.topLeft});
    }
}