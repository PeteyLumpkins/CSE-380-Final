import AABB from "../../../Wolfie2D/DataTypes/Shapes/AABB";
import Vec2 from "../../../Wolfie2D/DataTypes/Vec2";
import OrthogonalTilemap from "../../../Wolfie2D/Nodes/Tilemaps/OrthogonalTilemap";
import PlayerController from "../../AI/Player/PlayerController";
import PlayerInventory from "../../AI/Player/PlayerInventory";
import PlayerStats from "../../AI/Player/PlayerStats";
import StoreController from "../../AI/Store/StoreController";
import { GameLayers, GameSprites } from "../../GameEnums";

import items from "./items.json";

import GameLevel from "./GameLevel";
import Level1 from "../GameLevels/Level1";

import StoreItems from "../../AI/Store/StoreItems";
import LevelEndAI from "../../AI/LevelEnd/LevelEndAI";

import RandUtils from "../../../Wolfie2D/Utils/RandUtils";
import { GameEventType } from "../../../Wolfie2D/Events/GameEventType";


export default class Shop extends GameLevel {

    public static readonly PLAYER_SPAWN_POS = new Vec2(160, 352);
    public static readonly NEXT_LEVEL_POS = new Vec2(160, 352);

    protected walls: OrthogonalTilemap;
    private next: new (...args: any) => GameLevel;
    private nextLevelSpawn: Vec2;

    loadScene(): void {
        super.loadScene();
        this.load.tilemap("level", "assets/tilemaps/shopLevel.json");
        this.load.spritesheet("merchant", "assets/spritesheets/store/merchant.json");
        this.load.audio("buySound", "assets/soundEffects/shopBuy.wav");
        this.load.audio("textbox", "assets/soundEffects/textbox.wav");
        this.load.audio("shopMusic", "assets/music/shop.wav");
    }

    unloadScene(): void {
        super.unloadScene();
        this.emitter.fireEvent(GameEventType.STOP_SOUND, {key: "shopMusic"});
    }

    initScene(init: Record<string, any>): void {
        this.playerSpawn = init.spawn !== undefined ? init.spawn : Vec2.ZERO;
        this.startingItems = init.inventory !== undefined ? init.inventory.getCopy() : [];
        this.startingStats = init.stats !== undefined ? init.stats.getCopy() : {};

        this.next = init.nextLevel !== undefined ? init.nextLevel : Level1;
        this.nextLevelSpawn = init.nextLevelSpawn !== undefined ? init.nextLevelSpawn : Vec2.ZERO
    }

    startScene(): void {
        this.addLayer(GameLayers.PRIMARY, 5);
        super.startScene();
        this.emitter.fireEvent(GameEventType.PLAY_SOUND, {key: "shopMusic", loop: true, holdReference: true});
    }

    initPlayer(): void {
        // Placeholder initplayer, will want to transfer data later
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

    initEnemies(): void {}

    initStore(): void {
        let storeRandItem=new Array<string>();
        for(let i=0; i<3; i++){
            let j = RandUtils.randInt(0,items.length);
            while(storeRandItem.includes(items[j].key)){ //Ensures that no dupes are in the store
                j = RandUtils.randInt(0,items.length);
            }
            storeRandItem[i]=items[j].key;
        }
        let storeItems = new StoreItems(
            [
                {key: storeRandItem[0], count: 1},
                {key: storeRandItem[1], count: 1},
                {key: storeRandItem[2], count: 1}
            ]
        )

        this.store = this.add.animatedSprite("merchant", GameLayers.PRIMARY);
        this.store.position.set(256, 250);
        this.store.addAI(StoreController, {radius: 100, target: this.player, items: storeItems});
    }

    initMap(): void {
        let tilemapLayers = this.add.tilemap("level");

        this.getTilemap("Floor").getLayer().setDepth(1);
        this.getTilemap("Wall").getLayer().setDepth(1);

         // Get the wall layer
        this.walls = <OrthogonalTilemap>tilemapLayers[0].getItems()[0];

        // Set the viewport bounds to the tilemap
        let tilemapSize: Vec2 = this.walls.size;

        this.viewport.setCenter((tilemapSize.x / 2), (tilemapSize.y / 2));
        this.viewport.setBounds(0, 0, tilemapSize.x, tilemapSize.y);
    }

    initLevelLinks(): void {
        this.nextLevel = this.add.sprite(GameSprites.LADDER, GameLayers.PRIMARY);
        this.nextLevel.position.copy(Shop.NEXT_LEVEL_POS);
        // NextLevel should be the one that is passed into this file, as to loop back to the level it came from.
        this.nextLevel.addAI(LevelEndAI, {player: this.player, range: 25, nextLevel: this.next, nextLevelData: {
            spawn: this.nextLevelSpawn, 
            inventory: (<PlayerController>this.player._ai).playerInventory,
            stats: (<PlayerController>this.player._ai).playerStats
        }});
    }

    initViewport(): void {
        this.viewport.setZoomLevel(2);
    }


}