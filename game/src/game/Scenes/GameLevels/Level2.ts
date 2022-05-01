import GameLevel from "../GameLevel";
import AABB from "../../../Wolfie2D/DataTypes/Shapes/AABB";
import OrthogonalTilemap from "../../../Wolfie2D/Nodes/Tilemaps/OrthogonalTilemap";
import AnimatedSprite from "../../../Wolfie2D/Nodes/Sprites/AnimatedSprite";
import StoreController from "../../AI/Store/StoreController";
import PlayerController from "../../AI/Player/PlayerController";
import { GameSprites, GameData, ItemSprites, GameLayers } from "../../GameEnums";
import Vec2 from "../../../Wolfie2D/DataTypes/Vec2";
import PositionGraph from "../../../Wolfie2D/DataTypes/Graphs/PositionGraph";
import Navmesh from "../../../Wolfie2D/Pathfinding/Navmesh";
import { GraphicType } from "../../../Wolfie2D/Nodes/Graphics/GraphicTypes";


import LevelEndAI from "../../AI/LevelEnd/LevelEndAI";


import items from "./items.json";
import Player from "../../Player/Player";
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

        this.load.image(GameSprites.LADDER, "assets/sprites/EndOfLevel.png");

    }

    startScene(): void {
        super.startScene();
        
        console.log(this.load.getObject("item-meta"));
        this.addLayer(GameLayers.PRIMARY, 5);

        super.startScene();

    }

    initPlayer(): void {
        // Need way to transfer stats from previous level (if any)
        let scale = this.viewport.getZoomLevel();
        let scalar = new Vec2(scale, scale);

        let playerNode = this.add.animatedSprite("player", GameLayers.PRIMARY);
        let inventory = new Array<string>();
        let stats = {"HEALTH": 20, "MONEY": 10, "MOVE_SPEED": 1};

        this.player = new Player(playerNode, inventory, stats);

		playerNode.position.set(416, 416);
		let playerCollider = new AABB(Vec2.ZERO, new Vec2(playerNode.sizeWithZoom.x, playerNode.sizeWithZoom.y).div(scalar).div(new Vec2(2, 2)));
        playerNode.addPhysics();
		playerNode.setCollisionShape(playerCollider);
		playerNode.addAI(PlayerController, {inventory: this.player.inventory, stats: this.player.stats});

        this.viewport.follow(playerNode);
    }

    initEnemies(): void {}

    initStore(): void {
        let items = ["moldy_bread", "old_boot", "mystery_liquid"];

        this.store = this.add.animatedSprite("store_terminal", GameLayers.PRIMARY);
        this.store.position.set(832, 224);
        this.store.scale.set(0.4, 0.4);
        this.store.addAI(StoreController, {radius: 100, player: this.player, items: items});
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

        let gLayer = this.addLayer(GameLayers.NAVMESH_GRAPH, 10);
        // gLayer.setHidden(true);

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

    initLevelLinks(): void {}

    initViewport(): void {
        this.viewport.setZoomLevel(1);
    }


}