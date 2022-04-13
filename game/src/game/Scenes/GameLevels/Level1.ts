import AABB from "../../../Wolfie2D/DataTypes/Shapes/AABB";
import Vec2 from "../../../Wolfie2D/DataTypes/Vec2";
import OrthogonalTilemap from "../../../Wolfie2D/Nodes/Tilemaps/OrthogonalTilemap";
import AnimatedSprite from "../../../Wolfie2D/Nodes/Sprites/AnimatedSprite";
import StoreController from "../../AI/Store/StoreController";
import PlayerController from "../../AI/Player/PlayerController";
import { GameSprites, EnemyStatuses, GameData, ItemSprites, GameLayers } from "../../GameEnums";
import PositionGraph from "../../../Wolfie2D/DataTypes/Graphs/PositionGraph";
import Navmesh from "../../../Wolfie2D/Pathfinding/Navmesh";
import { GraphicType } from "../../../Wolfie2D/Nodes/Graphics/GraphicTypes";

import { RatAIOptionType } from "../../AI/Enemy/Rat/RatAI";

import GameLevel from "../GameLevel";
import LevelEndAI from "../../AI/LevelEnd/LevelEndAI";
import GameStore from "../../Entities/GameStore";

import RatAI from "../../AI/Enemy/Rat/RatAI";
import RatAttack from "../../AI/Enemy/Rat/RatActions/RatAttack";
import RatMove from "../../AI/Enemy/Rat/RatActions/RatMove";


export default class Level1 extends GameLevel {

    // The wall layer of the tilemap to use for bullet visualization
    protected walls: OrthogonalTilemap;

    private PLAYER_SPAWN: Vec2 = new Vec2(448, 480);

    loadScene(){
        this.load.tilemap("level", "assets/tilemaps/prototypeMap.json");

        this.load.spritesheet("player", "assets/spritesheets/player.json");
        this.load.spritesheet("store_terminal", "assets/spritesheets/store_terminal.json");
        this.load.spritesheet("brokenGreenPipe", "assets/sprites/BrokenGreenPipe.json");
        this.load.spritesheet(GameSprites.STORE_BG, "assets/spritesheets/store_layer.json");
        this.load.spritesheet("rat", "assets/spritesheets/rat.json");
        this.load.spritesheet(GameSprites.COIN, "assets/spritesheets/coin.json");

        this.load.object(GameData.NAVMESH, "assets/data/navmeshLevel1.json"); 
        this.load.object(GameData.STORE_ITEMS, "assets/data/items.json");

        this.load.image(ItemSprites.MOLD_BREAD, "assets/itemsprites/moldBread.png");
        this.load.image(GameSprites.LADDER, "assets/sprites/EndOfLevel.png");
    }

    /**
     * The "Scene" class has an options parameter that we'll use to pass the players
     * health and buffs through the game levels.
     */
    startScene(){

        this.initMap();

        this.addLayer("primary", 5);

        this.initPlayer();

        this.initEnemies();

        this.initStore();

        this.initLevelLinks();
        
        let bgPipe = this.add.animatedSprite("brokenGreenPipe", "primary");
        bgPipe.animation.play("idle", true);
        bgPipe.position.set(880, 432);

        super.startScene();
    }

    initPlayer(): void {
        this.player = this.add.animatedSprite("player", "primary");
		
		this.player.position.set(448, 480);
        // this.player.scale.set(.75, .75);

		let playerCollider = new AABB(Vec2.ZERO, new Vec2(this.player.sizeWithZoom.x / 4, this.player.sizeWithZoom.y / 8));
        this.player.addPhysics();
		this.player.setCollisionShape(playerCollider);
        
		// Add a playerController to the player
		this.player.addAI(PlayerController);
        this.viewport.follow(this.player);
    }

    initStore(): void {
        this.store = new GameStore();
        this.store.node = this.add.animatedSprite("store_terminal", "primary");
        this.store.node.position.set(1056, 1152);
        (<AnimatedSprite>this.store.node).scale.set(0.4, 0.4);
        this.store.node.addAI(StoreController, {radius: 100, player: this.player});

        this.store.items = this.load.getObject(GameData.STORE_ITEMS);
    }

    initMap(): void {
        let tilemapLayers = this.add.tilemap("level");
        // FIXME: the player should be able to move under the pipes but for some reason it doesn't work,
        // I'm not sure what's up with the layering.
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

    initLevelLinks(): void {
        this.nextLevel = this.add.sprite(GameSprites.LADDER, "primary");
        this.nextLevel.position.set(2960, 595);
        this.nextLevel.addAI(LevelEndAI, {player: this.player, range: 25, nextLevel: Level1});
    }

    initEnemies(): void {
        this.enemies = new Array<AnimatedSprite>();
        this.enemies[0] = this.add.animatedSprite("rat", "primary");
        this.enemies[0].position.set(1056, 1024);
        this.enemies[0].addPhysics();

        this.enemies[1] = this.add.animatedSprite("rat", "primary");
        this.enemies[1].position.set(1056, 928);
        this.enemies[1].addPhysics();

        this.enemies[2] = this.add.animatedSprite("rat", "primary");
        this.enemies[2].position.set(1056, 976);
        this.enemies[2].addPhysics();

        this.enemies[3] = this.add.animatedSprite("rat", "primary");
        this.enemies[3].position.set(1056, 850);
        this.enemies[3].addPhysics();


        let options = RatAI.optionsBuilder(RatAIOptionType.DEFAULT, this.player);

        this.enemies[0].addAI(RatAI, options);
        this.enemies[1].addAI(RatAI, options);
        this.enemies[2].addAI(RatAI, options);
        this.enemies[3].addAI(RatAI, options);

    }
}