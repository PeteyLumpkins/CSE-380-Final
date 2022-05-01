import AABB from "../../../Wolfie2D/DataTypes/Shapes/AABB";
import OrthogonalTilemap from "../../../Wolfie2D/Nodes/Tilemaps/OrthogonalTilemap";
import AnimatedSprite from "../../../Wolfie2D/Nodes/Sprites/AnimatedSprite";
import StoreController from "../../AI/Store/StoreController";
import PlayerController from "../../AI/Player/PlayerController";
import { GameSprites, GameData, GameLayers } from "../../GameEnums";
import Vec2 from "../../../Wolfie2D/DataTypes/Vec2";
import PositionGraph from "../../../Wolfie2D/DataTypes/Graphs/PositionGraph";
import Navmesh from "../../../Wolfie2D/Pathfinding/Navmesh";
import { GraphicType } from "../../../Wolfie2D/Nodes/Graphics/GraphicTypes";
import { GameEventType } from "../../../Wolfie2D/Events/GameEventType";
import { RatAIOptionType } from "../../AI/Enemy/Rat/RatAI";

import GameLevel from "../GameLevel";
import LevelEndAI from "../../AI/LevelEnd/LevelEndAI";

import RatAI from "../../AI/Enemy/Rat/RatAI";

import items from "./items.json";

import Level2 from "./Level2";

import PlayerStats from "../../AI/Player/PlayerStats";
import PlayerInventory from "../../AI/Player/PlayerInventory";
import Sprite from "../../../Wolfie2D/Nodes/Sprites/Sprite";
import Shop from "./Shop";
import StoreItems from "../../AI/Store/StoreItems";


export default class Level1 extends GameLevel {

    // The wall layer of the tilemap to use for bullet visualization
    protected walls: OrthogonalTilemap;
    protected navmeshGraph: PositionGraph;

    private PLAYER_SPAWN: Vec2 = new Vec2(448, 480);    // Default Spawn
    private prevInventory: Array<string>;               // Carry in inventory from previous level 

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

        this.load.audio("level1", "assets/music/Level1.wav");
        this.load.audio("hitSound", "assets/soundEffects/smack.wav");
        this.load.audio("coinSound", "assets/soundEffects/coin.wav");
        this.load.audio("footstep", "assets/soundEffects/footstep1.wav");
        this.load.audio("buySound", "assets/soundEffects/shopBuy.wav");
        this.load.audio("textbox", "assets/soundEffects/textbox.wav");

        this.load.audio("itemdrop", "assets/soundEffects/itemDrop.wav");
        this.load.audio("itempickup", "assets/soundEffects/itemPickup.wav");
        this.load.audio("invalidbuy", "assets/soundEffects/invalidStore.wav");

    }

    unloadScene(): void {
        this.emitter.fireEvent(GameEventType.STOP_SOUND, {key: "level1"});
        console.log("Unloading!");
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
        this.emitter.fireEvent(GameEventType.PLAY_SOUND, {key: "level1", loop: true, holdReference: true});
    }


    initViewport(): void {
        this.viewport.setZoomLevel(1);
    }


    initScene(init: Record<string, any>): void {
            this.PLAYER_SPAWN = init.spawn;
            console.log("Inside initScene: " + this.PLAYER_SPAWN);
    }


    initPlayer(): void {
        let scale = this.viewport.getZoomLevel();
        let scalar = new Vec2(scale, scale);

        this.player = this.add.animatedSprite("player", GameLayers.PRIMARY);
		this.player.position.set(this.PLAYER_SPAWN.x, this.PLAYER_SPAWN.y);     // Variable Spawn as shop location is different
		let playerCollider = new AABB(Vec2.ZERO, new Vec2(this.player.sizeWithZoom.x, this.player.sizeWithZoom.y).div(scalar).div(new Vec2(3, 3)));
        this.player.addPhysics();
		this.player.setCollisionShape(playerCollider);

        let inventory = new Array<string>();

        let stats = {"HEALTH": 20, "MONEY": 10, "MOVE_SPEED": 5};

		this.player.addAI(PlayerController, {inventory: new PlayerInventory(inventory, 9, this.prevInventory),
                                                stats: new PlayerStats(stats)});
        // Create new player inventory and then transfer items ( if any from previous )


        this.viewport.follow(this.player);

    }

    

    initStore(): void {
    
        // let storeItems = new StoreItems(
        //     [
        //         {key: "moldy_bread", count: 1},
        //         {key: "old_boot", count: 1},
        //         {key: "mystery_liquid", count: 1}
        //     ]
        // )

        // this.store = this.add.animatedSprite("store_terminal", GameLayers.PRIMARY);
        // this.store.position.set(1056, 1152);
        // this.store.scale.set(0.4, 0.4);
        // this.store.addAI(StoreController, {radius: 100, target: this.player, items: storeItems});
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
        this.drawHitbox();
    }

    initLevelLinks(): void {
        this.shop = this.add.sprite(GameSprites.LADDER, GameLayers.PRIMARY);
        this.shop.position.set(1056, 1184);
        this.shop.addAI(LevelEndAI, {player: this.player, range: 25, nextLevel: Shop});

        this.nextLevel = this.add.sprite(GameSprites.LADDER, GameLayers.PRIMARY);
        this.nextLevel.position.set(2960, 595);

        this.nextLevel.addAI(LevelEndAI, {player: this.player, range: 25, nextLevel: Level2});
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

    drawHitbox(): void {

        let ry = this.player.position.y;
        let rx = this.player.boundary.topRight.x - this.player.boundary.halfSize.x / 3;

        let box = new AABB(new Vec2(rx, ry), new Vec2(this.player.boundary.halfSize.x / 3, this.player.boundary.halfSize.y / 3));

        this.add.graphic(GraphicType.LINE, GameLayers.NAVMESH_GRAPH, {start: box.topLeft, end: box.topRight});
        this.add.graphic(GraphicType.LINE, GameLayers.NAVMESH_GRAPH, {start: box.topRight, end: box.bottomRight});
        this.add.graphic(GraphicType.LINE, GameLayers.NAVMESH_GRAPH, {start: box.bottomRight, end: box.bottomLeft});
        this.add.graphic(GraphicType.LINE, GameLayers.NAVMESH_GRAPH, {start: box.bottomLeft, end: box.topLeft});



        let ly = this.player.position.y;
        let lx = this.player.boundary.topLeft.x + this.player.boundary.halfSize.x / 3;

        box = new AABB(new Vec2(lx, ly), new Vec2(this.player.boundary.halfSize.x / 3, this.player.boundary.halfSize.y / 3));

        this.add.graphic(GraphicType.LINE, GameLayers.NAVMESH_GRAPH, {start: box.topLeft, end: box.topRight});
        this.add.graphic(GraphicType.LINE, GameLayers.NAVMESH_GRAPH, {start: box.topRight, end: box.bottomRight});
        this.add.graphic(GraphicType.LINE, GameLayers.NAVMESH_GRAPH, {start: box.bottomRight, end: box.bottomLeft});
        this.add.graphic(GraphicType.LINE, GameLayers.NAVMESH_GRAPH, {start: box.bottomLeft, end: box.topLeft});



        let uy = this.player.boundary.topRight.y + this.player.boundary.halfSize.y / 3;
        let ux = this.player.position.x;

        box = new AABB(new Vec2(ux, uy), new Vec2(this.player.boundary.halfSize.x / 3, this.player.boundary.halfSize.y / 3));

        this.add.graphic(GraphicType.LINE, GameLayers.NAVMESH_GRAPH, {start: box.topLeft, end: box.topRight});
        this.add.graphic(GraphicType.LINE, GameLayers.NAVMESH_GRAPH, {start: box.topRight, end: box.bottomRight});
        this.add.graphic(GraphicType.LINE, GameLayers.NAVMESH_GRAPH, {start: box.bottomRight, end: box.bottomLeft});
        this.add.graphic(GraphicType.LINE, GameLayers.NAVMESH_GRAPH, {start: box.bottomLeft, end: box.topLeft});



        let dy = this.player.boundary.bottomRight.y - this.player.boundary.halfSize.y / 3;
        let dx = this.player.position.x;

        box = new AABB(new Vec2(dx, dy), new Vec2(this.player.boundary.halfSize.x / 3, this.player.boundary.halfSize.y / 3));

        this.add.graphic(GraphicType.LINE, GameLayers.NAVMESH_GRAPH, {start: box.topLeft, end: box.topRight});
        this.add.graphic(GraphicType.LINE, GameLayers.NAVMESH_GRAPH, {start: box.topRight, end: box.bottomRight});
        this.add.graphic(GraphicType.LINE, GameLayers.NAVMESH_GRAPH, {start: box.bottomRight, end: box.bottomLeft});
        this.add.graphic(GraphicType.LINE, GameLayers.NAVMESH_GRAPH, {start: box.bottomLeft, end: box.topLeft});
    }
}