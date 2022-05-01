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

import { RatAIOptionType } from "../../AI/Enemy/Rat/RatAI";

import GameLevel from "../GameLevel";
import LevelEndAI from "../../AI/LevelEnd/LevelEndAI";

import RatAI from "../../AI/Enemy/Rat/RatAI";
import RatAttack from "../../AI/Enemy/Rat/RatActions/RatAttack";
import RatMove from "../../AI/Enemy/Rat/RatActions/RatMove";

import items from "./items.json";
import Player from "../../Player/Player";
import Level2 from "./Level2";


export default class Level1 extends GameLevel {

    // The wall layer of the tilemap to use for bullet visualization
    protected walls: OrthogonalTilemap;
    protected navmeshGraph: PositionGraph;

    private PLAYER_SPAWN: Vec2 = new Vec2(448, 480);

    loadScene(){
        
        this.load.tilemap("level", "assets/tilemaps/levelOne.json");

        for (let i = 0; i < items.length; i++) {
            this.load.image(items[i].key, items[i].path);
        }

        this.load.image("itembg", "assets/sprites/itembg.png");
        this.load.image("itembarbg", "assets/sprites/itembarbg.png");

        this.load.spritesheet("player", "assets/spritesheets/player/player.json");
        this.load.spritesheet("store_terminal", "assets/spritesheets/store/store_terminal.json");
        this.load.spritesheet("brokenGreenPipe", "assets/sprites/BrokenGreenPipe.json");
        this.load.spritesheet(GameSprites.STORE_BG, "assets/spritesheets/store/store_layer.json");
        this.load.spritesheet("rat", "assets/spritesheets/enemies/rat.json");
        this.load.spritesheet("whiteRat", "assets/spritesheets/enemies/whiteRat.json");
        this.load.spritesheet(GameSprites.COIN, "assets/spritesheets/coin.json");
        this.load.object('item-data', 'assets/data/item-data.json');
        // this.load.spritesheet("bat", "assets/spritesheets/WhiffleBat.json");

        this.load.object(GameData.NAVMESH, "assets/data/navmeshLevel1.json"); 
        this.load.object(GameData.STORE_ITEMS, "assets/data/item-data.json");
        this.load.object("enemyData", "assets/data/enemyLevel1.json");

        // this.load.image(ItemSprites.MOLD_BREAD, "assets/itemsprites/moldBread.png");
        // this.load.image(ItemSprites.OLD_BOOT, "assets/itemsprites/oldBoot.png");
        this.load.image(GameSprites.LADDER, "assets/sprites/EndOfLevel.png");
    }

    /**
     * The "Scene" class has an options parameter that we'll use to pass the players
     * health and buffs through the game levels.
     */
    startScene(){
        console.log(this.load.getObject("item-meta"));
        this.addLayer(GameLayers.PRIMARY, 5);
        
        let bgPipe = this.add.animatedSprite("brokenGreenPipe", GameLayers.PRIMARY);
        bgPipe.animation.play("idle", true);
        bgPipe.position.set(880, 432);

        // this.itemBarBackground = this.add.sprite("itembarbg", GameLayers.UI);
        // this.itemBarBackground.position.set(this.viewport.getCenter().x, 32);
        super.startScene();
    }

    initViewport(): void {
        this.viewport.setZoomLevel(1);
    }

    initPlayer(): void {
        let scale = this.viewport.getZoomLevel();
        let scalar = new Vec2(scale, scale);

        let playerNode = this.add.animatedSprite("player", GameLayers.PRIMARY);
        let inventory = new Array<string>();
        let stats = {"HEALTH": 20, "MONEY": 10, "MOVE_SPEED": 3};

        this.player = new Player(playerNode, inventory, stats);

		playerNode.position.set(448, 480);
		let playerCollider = new AABB(Vec2.ZERO, new Vec2(playerNode.sizeWithZoom.x, playerNode.sizeWithZoom.y).div(scalar).div(new Vec2(2, 2)));
        playerNode.addPhysics();
		playerNode.setCollisionShape(playerCollider);
		playerNode.addAI(PlayerController, {inventory: this.player.inventory, stats: this.player.stats});

        this.viewport.follow(playerNode);
    }

    initStore(): void {
    
        let items = ["moldy_bread", "old_boot", "mystery_liquid"];

        this.store = this.add.animatedSprite("store_terminal", GameLayers.PRIMARY);
        this.store.position.set(1056, 1152);
        this.store.scale.set(0.4, 0.4);
        this.store.addAI(StoreController, {radius: 100, player: this.player, items: items});
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
        this.nextLevel = this.add.sprite(GameSprites.LADDER, GameLayers.PRIMARY);
        this.nextLevel.position.set(2960, 595);
        this.nextLevel.addAI(LevelEndAI, {player: this.player.node, range: 25, nextLevel: Level2});
    }

    initEnemies(): void {
        
        this.enemies = new Array<AnimatedSprite>();
        let enemyData = this.load.getObject("enemyData");
        let options = RatAI.optionsBuilder(RatAIOptionType.FAST, this.player);

        for (let i = 0; i < enemyData.enemies.length; i++) {
            this.enemies[i] = this.add.animatedSprite("rat", GameLayers.PRIMARY);
            this.enemies[i].position.set(enemyData.enemies[i].position[0], enemyData.enemies[i].position[1]);
            this.enemies[i].addAI(RatAI, options);
            this.enemies[i].addPhysics();

            console.log(this.enemies[i]);
        }

    }
}