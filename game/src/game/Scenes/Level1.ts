import AABB from "../../Wolfie2D/DataTypes/Shapes/AABB";
import Vec2 from "../../Wolfie2D/DataTypes/Vec2";
import OrthogonalTilemap from "../../Wolfie2D/Nodes/Tilemaps/OrthogonalTilemap";

import GameLevel from "./GameLevel";
import PlayerController from "../AI/Player/PlayerController";
import StoreController from "../AI/Store/StoreController";

export default class Level1 extends GameLevel {

    // The wall layer of the tilemap to use for bullet visualization
    private walls: OrthogonalTilemap;

    loadScene(){
        super.loadScene();
        this.load.tilemap("level", "assets/dummyMap.json");
        this.load.spritesheet("player", "assets/spritesheets/cars.json");
        this.load.spritesheet("store_terminal", "assets/spritesheets/store_terminal.json");
    }

    /**
     * The "Scene" class has an options parameter that we'll use to pass the players
     * health and buffs through the game levels.
     */
    startScene(){

        super.startScene();

        //Uncomment this code and comment the above code when you're using your tilemap
        let tilemapLayers = this.add.tilemap("level", new Vec2(0.5, 0.5));

         // Get the wall layer
        this.walls = <OrthogonalTilemap>tilemapLayers[1].getItems()[0];

        // Set the viewport bounds to the tilemap
        let tilemapSize: Vec2 = this.walls.size.scale(.5);

        this.viewport.setBounds(0, 0, tilemapSize.x, tilemapSize.y);

        console.log(this);

        this.addLayer("primary", 5);

        this.initPlayer();

        this.store = this.add.animatedSprite("store_terminal", "primary");

        this.store.position.set(this.viewport.getCenter().x, this.viewport.getCenter().y);
        // this.store.scale.set(0.4, 0.4);
        this.store.addAI(StoreController, {radius: 100, player: this.player});
    }

    protected initPlayer(){
        this.player = this.add.animatedSprite("player", "primary");
		
		// Set the player's position to the middle of the screen, and scale it down
		this.player.position.set(this.viewport.getCenter().x, this.viewport.getCenter().y);
		this.player.scale.set(0.4, 0.4);

		// Give the player a smaller hitbox
		console.log(this.player.sizeWithZoom.toString());
		console.log(this.player.size.toString());
		let playerCollider = new AABB(Vec2.ZERO, this.player.sizeWithZoom);
		this.player.setCollisionShape(playerCollider)

		// Add a playerController to the player
		this.player.addAI(PlayerController);
    }

    
}