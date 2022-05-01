import AABB from "../../../Wolfie2D/DataTypes/Shapes/AABB";
import Vec2 from "../../../Wolfie2D/DataTypes/Vec2";
import OrthogonalTilemap from "../../../Wolfie2D/Nodes/Tilemaps/OrthogonalTilemap";
import PlayerController from "../../AI/Player/PlayerController";
import PlayerInventory from "../../AI/Player/PlayerInventory";
import PlayerStats from "../../AI/Player/PlayerStats";
import StoreController from "../../AI/Store/StoreController";
import { GameData, GameLayers, GameSprites, ItemSprites } from "../../GameEnums";
import GameLevel from "../GameLevel";

import StoreItems from "../../AI/Store/StoreItems";
import items from "./items.json";
import LevelEndAI from "../../AI/LevelEnd/LevelEndAI";

import Level1 from "./Level1";
import StoreItems from "../../AI/Store/StoreItems";





export default class Shop extends GameLevel {
    protected walls: OrthogonalTilemap;
    protected prevInventory: Array<string>;
    loadScene(): void {
        this.load.tilemap("level", "assets/tilemaps/shopLevel.json");

        for (let i = 0; i < items.length; i++) {
            this.load.image(items[i].key, items[i].path);
        }

        this.load.image("itembg", "assets/sprites/itembg.png");
        this.load.image("itembarbg", "assets/sprites/itembarbg.png");

        this.load.spritesheet("player", "assets/spritesheets/player/player.json");
        this.load.spritesheet("merchant", "assets/spritesheets/store/merchant.json");
        this.load.spritesheet(GameSprites.STORE_BG, "assets/spritesheets/store/store_layer.json");
        this.load.spritesheet("rat", "assets/spritesheets/enemies/rat.json");
        this.load.object('item-data', 'assets/data/item-data.json');

        this.load.object(GameData.STORE_ITEMS, "assets/data/item-data.json");

        this.load.image(GameSprites.LADDER, "assets/sprites/EndOfLevel.png");

        this.load.audio("buySound", "assets/soundEffects/shopBuy.wav");
        this.load.audio("textbox", "assets/soundEffects/textbox.wav");

    }

    unloadScene(): void {
        this.load.keepImage("itembg");
        this.load.keepImage("itembarbg");
        console.log("Unloading!");

    }

    startScene(): void {
        console.log(this.load.getObject("item-meta"));
        this.addLayer(GameLayers.PRIMARY, 5);

        super.startScene();
    }

    initPlayer(): void {
        // Placeholder initplayer, will want to transfer data later
        let scale = this.viewport.getZoomLevel();
        let scalar = new Vec2(scale, scale);

        this.player = this.add.animatedSprite("player", GameLayers.PRIMARY);
		this.player.position.set(160, 352);
		let playerCollider = new AABB(Vec2.ZERO, new Vec2(this.player.sizeWithZoom.x, this.player.sizeWithZoom.y).div(scalar).div(new Vec2(2, 2)));
        this.player.addPhysics();
		this.player.setCollisionShape(playerCollider);

        let inventory = new Array<string>();
        let stats = {"HEALTH": 20, "MONEY": 10, "MOVE_SPEED": 1};
		this.player.addAI(PlayerController, {inventory: new PlayerInventory(inventory, 9, this.prevInventory), stats: new PlayerStats(stats)});

        this.viewport.follow(this.player);
    }

    initEnemies(): void {}

    initStore(): void {
        let storeItems = new StoreItems(
            [
                {key: "moldy_bread", count: 1},
                {key: "old_boot", count: 1},
                {key: "mystery_liquid", count: 1}
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

        this.viewport.setZoomLevel(1);
        this.viewport.setCenter((tilemapSize.x / 2), (tilemapSize.y / 2));
        this.viewport.setBounds(0, 0, tilemapSize.x, tilemapSize.y);
    }

    initLevelLinks(): void {
        this.nextLevel = this.add.sprite(GameSprites.LADDER, GameLayers.PRIMARY);
        this.nextLevel.position.set(160, 352);
        // NextLevel should be the one that is passed into this file, as to loop back to the level it came from.
        this.nextLevel.addAI(LevelEndAI, {player: this.player, range: 25, nextLevel: Level1, spawn: new Vec2(1056, 1200)});
    }

    initViewport(): void {}


}