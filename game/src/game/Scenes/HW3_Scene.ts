import AABB from "../../Wolfie2D/DataTypes/Shapes/AABB";
import Vec2 from "../../Wolfie2D/DataTypes/Vec2";
import GameNode from "../../Wolfie2D/Nodes/GameNode";
import Graphic from "../../Wolfie2D/Nodes/Graphic";
import { GraphicType } from "../../Wolfie2D/Nodes/Graphics/GraphicTypes";
import AnimatedSprite from "../../Wolfie2D/Nodes/Sprites/AnimatedSprite";
import Label from "../../Wolfie2D/Nodes/UIElements/Label";
import { UIElementType } from "../../Wolfie2D/Nodes/UIElements/UIElementTypes";
import Scene from "../../Wolfie2D/Scene/Scene";
import Color from "../../Wolfie2D/Utils/Color";
import RandUtils from "../../Wolfie2D/Utils/RandUtils";
import RockAI from "../AI/RockAI";
import BulletBehavior from "../AI/BulletAI";
import { Homework3Animations, Homework3Event, Homework3Shaders } from "../HW3_Enums";
import CarPlayerController from "../AI/CarPlayerController";
import Circle from "../../Wolfie2D/DataTypes/Shapes/Circle";
import GameOver from "./GameOver";
import ShaderType from "../../Wolfie2D/Rendering/WebGLRendering/ShaderType";
import Sprite from "../../Wolfie2D/Nodes/Sprites/Sprite";
import CanvasNode from "../../Wolfie2D/Nodes/CanvasNode";
import Shape from "../../Wolfie2D/DataTypes/Shapes/Shape";
import Timer from "../../Wolfie2D/Timing/Timer";

/**
 * In Wolfie2D, custom scenes extend the original scene class.
 * This gives us access to lifecycle methods to control our game.
 */
export default class Homework3_Scene extends Scene {
	// Here we define member variables of our game, and object pools for adding in game objects
	private player: AnimatedSprite;
	private playerDead: boolean = false;
	private playerHealth: number = 5;
	private playerinvincible: boolean = false;
	private mineralAmount: number = 0;
	private MIN_SPAWN_DISTANCE: number = 100;

	// Create an object pool for our bullets
	private MAX_BULLETS_SIZE = 5;
	private bullets: Array<Graphic> = new Array(this.MAX_BULLETS_SIZE);

	// Create an object pool for our rocks
	private MAX_NUM_ROCKS = 15;
	private INITIAL_NUM_ROCKS = 1;
	private rocks: Array<Sprite> = new Array(this.MAX_NUM_ROCKS);

	// Create an object pool for our minerals
	private MAX_NUM_MINERALS = 20;
	private minerals: Array<Graphic> = new Array(this.MAX_NUM_MINERALS);

	// Labels for the gui
	private mineralsLabel: Label;
	private healthLabel: Label;

	// Timers
	private rockTimer: number = 0;
	private ROCK_MAX_TIME: number = 0.5;	// Spawn an rock every 10 seconds
	private mineralTimer: number = 0;
	private MINERAL_MAX_TIME: number = 5; // Spawn a mineral every 5 seconds
	private gameEndTimer: number = 0;
	private GAME_END_MAX_TIME: number = 3;

	private gameScoreTimer: number = 0;

	// Other variables
	private WORLD_PADDING: Vec2 = new Vec2(64, 64);
	private ROCK_SPEED: number = 300;
	private ROCK_SPEED_INC: number = 10;

	private bg1: Sprite;
	private bg2: Sprite;

	// HOMEWORK 3 - TODO 
	/*
		You'll want to be sure to load in your own sprite here
	*/
	/*
	 * loadScene() overrides the parent class method. It allows us to load in custom assets for
	 * use in our scene.
	 */
	loadScene(){
		/* ##### DO NOT MODIFY ##### */
		// Load in the player car spritesheet
		this.load.spritesheet("player", "hw3_assets/spritesheets/cars.json");

		// Load in the background image
		this.load.image("desert_road", "hw3_assets/sprites/road.jpg");

		this.load.image("rock", "hw3_assets/sprites/stone.png");
	}

	/*
	 * startScene() allows us to add in the assets we loaded in loadScene() as game objects.
	 * Everything here happens strictly before update
	 */
	startScene(){
		/* ##### DO NOT MODIFY ##### */
		// Create a background layer
		this.addLayer("background", 0);

		// Add in the background image
		this.bg1 = this.add.sprite("desert_road", "background");
		this.bg2 = this.add.sprite("desert_road", "background");
		this.bg1.scale.set(1.5, 1.5);
		this.bg1.position.copy(this.viewport.getCenter());

		this.bg2.scale.set(1.5, 1.5);
		this.bg2.position = this.bg1.position.clone();
		this.bg2.position.add(this.bg1.sizeWithZoom.scale(0, -2));

		// Create a layer to serve as our main game - Feel free to use this for your own assets
		// It is given a depth of 5 to be above our background
		this.addLayer("primary", 5);

		// Initialize the player
		this.initializePlayer();
		
		// Initialize the UI
		// this.initializeUI();

		// // Initialize object pools
		// this.initializeObjectPools();

		// // Spawn some rocks to start the game
		// for(let i = 0; i < this.INITIAL_NUM_ROCKS; i++){
		// 	this.spawnRock();
		// }

		// // Initialize variables
		// RockAI.SPEED = this.ROCK_SPEED;

		// // Subscribe to events
		// this.receiver.subscribe(Homework3Event.PLAYER_I_FRAMES_END);
		// this.receiver.subscribe(Homework3Event.PLAYER_DEAD);
		// this.receiver.subscribe(Homework3Event.SHOOT_BULLET);
		// this.receiver.subscribe(Homework3Event.BULLET_USED);
	}

	/**
	 * To create the illusion of a never ending desert road, we maintain two identical background and move them as the game progresses.
	 * When one background is moved completely offscreen at the bottom, it will get moved back to the top to continue the cycle.
	 */
	moveBackgrounds(deltaT: number): void {
		let move = new Vec2(0, 150);
		this.bg1.position.add(move.clone().scaled(deltaT));
		this.bg2.position.add(move.clone().scaled(deltaT));

		let edgePos = this.viewport.getCenter().clone().add(this.bg1.sizeWithZoom.clone().scale(0, 2));

		if (this.bg1.position.y >= edgePos.y){
			this.bg1.position = this.viewport.getCenter().clone().add(this.bg1.sizeWithZoom.clone().scale(0, -2))
		}
		if (this.bg2.position.y >= edgePos.y){
			this.bg2.position = this.viewport.getCenter().clone().add(this.bg2.sizeWithZoom.clone().scale(0, -2))
		}
	}

	/*
	 * updateScene() is where the real work is done. This is where any custom behavior goes.
	 */
	updateScene(deltaT: number){
		// Handle events we care about
		this.handleEvents();

		this.moveBackgrounds(deltaT);

		// this.handleCollisions();

		// this.handleTimers(deltaT);

		// Get the viewport center and padded size
		const viewportCenter = this.viewport.getCenter().clone();
		const paddedViewportSize = this.viewport.getHalfSize().scaled(2).add(this.WORLD_PADDING.scaled(2));
		const baseViewportSize = this.viewport.getHalfSize().scaled(2);

		// Check the position of our player
		this.lockPlayer(viewportCenter, baseViewportSize);
	
	}

	/* #################### CUSTOM METHODS #################### */

	/* ########## START SCENE METHODS ########## */

	initializePlayer(): void {
		// Add in the player as an animated sprite
		// We give it the key specified in our load function and the name of the layer
		this.player = this.add.animatedSprite("player", "primary");
		
		// Set the player's position to the middle of the screen, and scale it down
		this.player.position.set(this.viewport.getCenter().x, this.viewport.getCenter().y);
		this.player.scale.set(0.4, 0.4);

		// Play the idle animation by default
		this.player.animation.play(Homework3Animations.CAR_DRIVE);

		// Give the player a smaller hitbox
		console.log(this.player.sizeWithZoom.toString());
		console.log(this.player.size.toString());
		let playerCollider = new AABB(Vec2.ZERO, this.player.sizeWithZoom);
		this.player.setCollisionShape(playerCollider)

		// Add a playerController to the player
		this.player.addAI(CarPlayerController);
	}

	initializeUI(): void {
		// UILayer stuff
		this.addUILayer("ui");

		// Minerals label
		this.mineralsLabel = <Label>this.add.uiElement(UIElementType.LABEL, "ui", {position: new Vec2(125, 50), text: `Minerals: ${this.mineralAmount}`});
		this.mineralsLabel.size.set(200, 50);
		this.mineralsLabel.setHAlign("left");
		this.mineralsLabel.textColor = Color.WHITE;

		// Health label
		this.healthLabel = <Label>this.add.uiElement(UIElementType.LABEL, "ui", {position: new Vec2(375, 50), text: `Health: ${this.playerHealth}`});
		this.healthLabel.size.set(200, 50);
		this.healthLabel.setHAlign("left");
		this.healthLabel.textColor = Color.WHITE;
	}

	initializeObjectPools(): void {

	}

	initializeAI(): void {

	}

	

	/* ########## UPDATE SCENE METHODS ########## */
	
	
	handleEvents(){
		
	}
	
	handleCollisions(){
		
	}

	handleTimers() {

	}
	 

	// HOMEWORK 3 - TODO (3. BOUND CAR)
	/**
	 * This function is similar to the despawn function above, except there's no padded area since we
	 * want tight bounds. Using a similar illustration from above:
	 * 
	 * o's represent valid locations for the player,
	 * X's represent invalid locations.
	 * 
	 * 								X
	 * 			 _______________________________		
	 * 			|						o		|	
	 * 			|								|		
	 *			X	  THIS IS THE VISIBLE		|	
	 * 			|			 REGION				|		
	 * 			|								|	
	 * 		X	|		o						|		
	 * 			|_______________________________|		
	 * 
	 * Note that the player cannot be halfway off the screen either vertically or horizontally, it must always be fully visible
	 * 								
	 * @param viewportCenter The center of the viewport
	 * @param viewportSize The size of the viewport
	 */
	lockPlayer(viewportCenter: Vec2, viewportSize: Vec2): void {

		if (this.player.position.x > viewportCenter.x * 2 - (this.player.size.x / 2 / this.player.cols)) {
			this.player.position.x = viewportSize.x - (this.player.size.x / 2 / this.player.cols);
		} else if (this.player.position.x < this.player.size.x / 2 / this.player.cols) {
			this.player.position.x = (this.player.size.x / 2 / this.player.cols);
		}

		if (this.player.position.y > viewportCenter.y * 2 - (this.player.size.y / 2 / this.player.rows)) {
			this.player.position.y = viewportSize.y - (this.player.size.y / 2 / this.player.rows);
		} else if (this.player.position.y < this.player.size.y / 2 / this.player.rows) {
			this.player.position.y = (this.player.size.y / 2 / this.player.rows);
		}
	}

}