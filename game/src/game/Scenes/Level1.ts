import AABB from "../../Wolfie2D/DataTypes/Shapes/AABB";
import Vec2 from "../../Wolfie2D/DataTypes/Vec2";
import OrthogonalTilemap from "../../Wolfie2D/Nodes/Tilemaps/OrthogonalTilemap";

import PlayerController from "../AI/Player/PlayerController";
import { GameSprites } from "../GameEnums";
import GameLevel from "./GameLevel";


export default class Level1 extends GameLevel {

    // The wall layer of the tilemap to use for bullet visualization
    private walls: OrthogonalTilemap;

    private PLAYER_SPAWN: Vec2 = new Vec2(448, 480);

    loadScene(){
        this.load.tilemap("level", "assets/tilemaps/prototypeMap.json");
        this.load.spritesheet("player", "assets/spritesheets/player.json");
        this.load.spritesheet("store_terminal", "assets/spritesheets/store_terminal.json");
        this.load.spritesheet("brokenGreenPipe", "assets/sprites/BrokenGreenPipe.json");
        this.load.spritesheet(GameSprites.STORE_BG, "assets/spritesheets/store_layer.json");
        this.load.object("navmesh", "assets/data/navmeshLevel1.json"); 
    }

    /**
     * The "Scene" class has an options parameter that we'll use to pass the players
     * health and buffs through the game levels.
     */
    startScene(){

        //Uncomment this code and comment the above code when you're using your tilemap
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
        this.viewport.follow(this.player);
        this.viewport.setZoomLevel(1);


        this.addLayer("primary", 5);

        this.initPlayer();
        
        let bgPipe = this.add.animatedSprite("brokenGreenPipe", "primary");
        bgPipe.animation.play("idle", true);
        bgPipe.position.set(880, 432);

        this.store = this.add.animatedSprite("store_terminal", "primary");

        this.store.position.set(this.viewport.getCenter().clone().x + 64, this.viewport.getCenter().clone().y - 32);
        this.store.scale.set(0.4, 0.4);
        this.store.addAI(StoreController, {radius: 100, player: this.player});

        super.startScene();
    }

    protected initPlayer(){
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

    
}