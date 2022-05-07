import Vec2 from "../../../Wolfie2D/DataTypes/Vec2";
import { UIElementType } from "../../../Wolfie2D/Nodes/UIElements/UIElementTypes";
import Layer from "../../../Wolfie2D/Scene/Layer";
import Scene from "../../../Wolfie2D/Scene/Scene";
import Color from "../../../Wolfie2D/Utils/Color";
import Sprite from "../../../Wolfie2D/Nodes/Sprites/Sprite";
import { MenuImages, MenuEvents, MenuLayers } from "../../GameEnums";
import GameLevel from "../GameLevel";
import Level1 from "./Level1";
import Label from "../../../Wolfie2D/Nodes/UIElements/Label";
import { GameEventType } from "../../../Wolfie2D/Events/GameEventType";


//! TODO: Testing purposes for the shop level
import Shop from "./Shop";
import Button from "../../../Wolfie2D/Nodes/UIElements/Button";

/** 
 * TODO: The position of the logo should be moved on each of the screens so that it 
 * doesn't overlap any of the buttons or text on the screens.
*/
export default class MainMenu extends Scene {

    // Sets the next first level to be loaded as level1
    // private nextLevel: new (...args: any) => GameLevel = PrototypeLevel;

    // Layers, for multiple main menu screens
    private splash: Layer; //added, we need a new layer for the splash screen
    private mainMenu: Layer;
    private controls: Layer;
    private about: Layer;
    private levels: Layer;
    private logo: Layer;
    private background: Layer;

    // This is the background image of the tunnels
    private background_image: Sprite;

    // This will be our games logo image
    private logo_image: Sprite;

    // Preview images of the levels
    private level1_preview: Sprite;

    loadScene(){
        // this.load.image(MenuImages.BACKGROUND, "assets/images/background.jpeg");
        this.load.image(MenuImages.LOGO, "assets/images/logo_no_white.png");
        this.load.audio("menu", "assets/music/menu.wav");
    }

    startScene(){
        // When we return to main menu from the game -> need to reset the viewport bounds
        this.viewport.setBounds(0, 0, 1024, 1024);
        this.viewport.setZoomLevel(1);

        let center = this.viewport.getCenter();
        center.sub(this.viewport.getOrigin());

        console.log("ZOOM LEVEL IN MAIN MENU: " + this.viewport.getZoomLevel());

        // The background layer
        // this.background = this.addLayer(MenuLayers.BACKGROUND, 0);
        // this.background_image = this.add.sprite(MenuImages.BACKGROUND, MenuLayers.BACKGROUND);
		// this.background_image.scale.set(.5, .5);
		// this.background_image.position.copy(this.viewport.getCenter());

        // The logo layer?
        this.logo = this.addLayer(MenuLayers.LOGO, 1);
        this.logo_image = this.add.sprite(MenuImages.LOGO, MenuLayers.LOGO);
        this.logo_image.scale.set(.25, .25);

        this.logo_image.position.copy(center);

        // Splash Screen
        this.initSplash();

        // Main Menu Screen
        this.initMainMenu();

        // Controls screen
        this.initControls();

        // Help screen
        this.initHelp();

        // Levels screen
        this.initLevels();

        // Subscribe to the button events
        this.receiver.subscribe(MenuEvents.PLAY_GAME);
        this.receiver.subscribe(MenuEvents.HELP);
        this.receiver.subscribe(MenuEvents.CONTROLS);
        this.receiver.subscribe(MenuEvents.MAIN_MENU);
        this.receiver.subscribe(MenuEvents.LEVELS);

        this.emitter.fireEvent(GameEventType.PLAY_SOUND, {key: "menu", loop: true, holdReference: true});
    }

    updateScene(){
        while(this.receiver.hasNextEvent()){
            let event = this.receiver.getNextEvent();

            if(event.type === MenuEvents.PLAY_GAME){
                this.sceneManager.changeToScene(Level1, {spawn: new Vec2(448, 480), stats: {"HEALTH": 20, "MONEY": 0, "MOVE_SPEED": 3}});
            }

            if(event.type === MenuEvents.CONTROLS){
                this.logo_image.visible = false;
                this.controls.setHidden(false);
                this.mainMenu.setHidden(true);
            }

            if(event.type === MenuEvents.HELP){
                this.logo_image.visible = false;
                this.about.setHidden(false);
                this.mainMenu.setHidden(true);
            }

            if(event.type === MenuEvents.MAIN_MENU){
                this.mainMenu.setHidden(false);

                let center = this.viewport.getCenter();
                center.sub(this.viewport.getOrigin());
                this.logo_image.position.set(center.x, this.viewport.getOrigin().y + 150);
                this.logo_image.visible = true;

                this.controls.setHidden(true);
                this.about.setHidden(true);
                this.splash.setHidden(true);
                this.levels.setHidden(true);
            }

            if(event.type === MenuEvents.LEVELS) {
                this.logo_image.visible = false;
                this.levels.setHidden(false);
                this.mainMenu.setHidden(true);
            }
        }
    }

    initSplash(){
        let center = this.viewport.getCenter();

        // This is the splash menu
        this.splash = this.addUILayer(MenuLayers.SPLASH);

        
        const start = <Button> this.add.uiElement(UIElementType.BUTTON, MenuLayers.SPLASH, {position: new Vec2(center.x, center.y + 200), text: "Click to start"});
        start.font = "menu";
        start.size.set(300, 50);
        start.borderWidth = 2;
        start.borderColor = Color.WHITE;
        start.backgroundColor = Color.TRANSPARENT;
        start.onClickEventId = MenuEvents.MAIN_MENU;
    }

    initMainMenu() {
        let center = this.viewport.getCenter();

        // The main menu
        this.mainMenu = this.addUILayer(MenuLayers.MAIN_MENU);
        this.mainMenu.setHidden(true);



        // Add play button, and give it an event to emit on press
        const play = <Button> this.add.uiElement(UIElementType.BUTTON, MenuLayers.MAIN_MENU, {position: new Vec2(center.x, center.y - 100), text: "Play"});
        play.font = "menu";
        play.size.set(200, 50);
        play.borderWidth = 2;
        play.borderColor = Color.WHITE;
        play.backgroundColor = Color.TRANSPARENT;
        play.onClickEventId = MenuEvents.PLAY_GAME;

        // Add controls button
        const controls = <Button> this.add.uiElement(UIElementType.BUTTON, MenuLayers.MAIN_MENU, {position: new Vec2(center.x, center.y), text: "Controls"});
        controls.font = 'menu';
        controls.size.set(200, 50);
        controls.borderWidth = 2;
        controls.borderColor = Color.WHITE;
        controls.backgroundColor = Color.TRANSPARENT;
        controls.onClickEventId = MenuEvents.CONTROLS;

        // Add help button
        const about = <Button> this.add.uiElement(UIElementType.BUTTON, MenuLayers.MAIN_MENU, {position: new Vec2(center.x, center.y + 100), text: "About"});
        about.font = 'menu';
        about.size.set(200, 50);
        about.borderWidth = 2;
        about.borderColor = Color.WHITE;
        about.backgroundColor = Color.TRANSPARENT;
        about.onClickEventId = MenuEvents.HELP;

        // Add levels button
        const levels = <Button> this.add.uiElement(UIElementType.BUTTON, MenuLayers.MAIN_MENU, {position: new Vec2(center.x, center.y + 200), text: "Levels" });
        levels.font = 'menu';
        levels.size.set(200, 50);
        levels.borderWidth = 2;
        levels.borderColor = Color.WHITE;
        levels.backgroundColor = Color.TRANSPARENT;
        levels.onClickEventId = MenuEvents.LEVELS;
    }   

    initControls() {
        let center = this.viewport.getCenter();

        this.controls = this.addUILayer(MenuLayers.CONTROLS);
        this.controls.setHidden(true);

        const headerText = "Controls";
        const header = <Label>this.add.uiElement(UIElementType.LABEL, MenuLayers.CONTROLS, {position: new Vec2(center.x, center.y - 250), text: headerText});
        header.textColor = Color.WHITE;

        const moveText = "- WASD to move";
        const move = <Label>this.add.uiElement(UIElementType.LABEL, MenuLayers.CONTROLS, {position: new Vec2(center.x, center.y - 50), text: moveText});
        move.textColor = Color.WHITE;

        const attackText = "- Click/Space to attack";
        const attack = <Label>this.add.uiElement(UIElementType.LABEL, MenuLayers.CONTROLS, {position: new Vec2(center.x, center.y), text: attackText});
        attack.textColor = Color.WHITE;

        const pauseText = "- ESC to pause the game";
        const pause = <Label>this.add.uiElement(UIElementType.LABEL, MenuLayers.CONTROLS, {position: new Vec2(center.x, center.y + 50), text: pauseText});
        pause.textColor = Color.WHITE;
        

        const constBack = <Button> this.add.uiElement(UIElementType.BUTTON, MenuLayers.CONTROLS, {position: new Vec2(125, 100), text: "Back"});
        constBack.font = "menu";
        constBack.size.set(100, 50);
        constBack.borderWidth = 2;
        constBack.borderColor = Color.WHITE;
        constBack.backgroundColor = Color.TRANSPARENT;
        constBack.onClickEventId = MenuEvents.MAIN_MENU;
    }

    initHelp() {
        const center = this.viewport.getCenter();
        this.about = this.addUILayer(MenuLayers.HELP);
        this.about.setHidden(true);

        const aboutHeader = <Label>this.add.uiElement(UIElementType.LABEL, MenuLayers.HELP, {position: new Vec2(center.x, center.y - 300), text: "Story"});
        aboutHeader.textColor = Color.WHITE;

        const text1 = "Deep beneath Stony Brook Universities West Campus, evil stirs...";
        const text2 = "Recently, Peter's friends have been mysteriously disappearing around the Old Computer Science buidling. One day, when Peter";
        const text3 = "was leaving his office hours, he noticed a mysterious\n door he'd never seen before. Upon further inspection, he found a stairwell";
        const text4 = "that lead to the Old CS basement.";

        const text5 = "Peter's goal is to explore the basement of the old computer science building and wherever it leads. As he goes along he's likely to";
        const text6 = "encounter many foes, and potential hazards. After all, who knows whats been festering down there all these years. Armed with nothing";
        const text7 = "but a whiffel-ball bat he stole from the SBCS storage room, Peter's on a mission to explore the basement of the old computer science";
        const text8 = "building and rescue his friends."
        
        const line1 = <Label>this.add.uiElement(UIElementType.LABEL, MenuLayers.HELP, {position: new Vec2(center.x, center.y - 250), text: text1});
        const line2 = <Label>this.add.uiElement(UIElementType.LABEL, MenuLayers.HELP, {position: new Vec2(center.x, center.y - 200), text: text2});
        const line3 = <Label>this.add.uiElement(UIElementType.LABEL, MenuLayers.HELP, {position: new Vec2(center.x, center.y - 175), text: text3});
        const line4 = <Label>this.add.uiElement(UIElementType.LABEL, MenuLayers.HELP, {position: new Vec2(center.x, center.y - 150), text: text4});

        const line5 = <Label>this.add.uiElement(UIElementType.LABEL, MenuLayers.HELP, {position: new Vec2(center.x, center.y - 120), text: text5});
        const line6 = <Label>this.add.uiElement(UIElementType.LABEL, MenuLayers.HELP, {position: new Vec2(center.x, center.y - 95), text: text6});
        const line7 = <Label>this.add.uiElement(UIElementType.LABEL, MenuLayers.HELP, {position: new Vec2(center.x, center.y - 70), text: text7});
        const line8 = <Label>this.add.uiElement(UIElementType.LABEL, MenuLayers.HELP, {position: new Vec2(center.x, center.y - 45), text: text8});

        line1.textColor = Color.WHITE;
        line1.fontSize = 16;

        line2.textColor = Color.WHITE;
        line2.fontSize = 16;

        line3.textColor = Color.WHITE;
        line3.fontSize = 16;

        line4.textColor = Color.WHITE;
        line4.fontSize = 16;

        line5.textColor = Color.WHITE;
        line5.fontSize = 16;

        line6.textColor = Color.WHITE;
        line6.fontSize = 16;

        line7.textColor = Color.WHITE;
        line7.fontSize = 16;

        line8.textColor = Color.WHITE;
        line8.fontSize = 16;

        const creditsHeader = <Label>this.add.uiElement(UIElementType.LABEL, MenuLayers.HELP, {position: new Vec2(center.x, center.y), text: "Credits"});
        creditsHeader.textColor = Color.WHITE;

        const text9 = "An original game developed by Peter Walsh, Jeffery Tsang and Han Lin using the Wolfie2D";
        const text10 = "game engine developed by Joe Weaver, Zachary Grandison and Richard McKenna.";

        const line9 = <Label>this.add.uiElement(UIElementType.LABEL, MenuLayers.HELP, {position: new Vec2(center.x, center.y + 40), text: text9});
        const line10 = <Label>this.add.uiElement(UIElementType.LABEL, MenuLayers.HELP, {position: new Vec2(center.x, center.y + 65), text: text10});

        line9.textColor = Color.WHITE;
        line9.fontSize = 16;

        line10.textColor = Color.WHITE;
        line10.fontSize = 16;

        const aboutBack = this.add.uiElement(UIElementType.BUTTON, MenuLayers.HELP, {position: new Vec2(125, 100), text: "Back"});
        aboutBack.size.set(100, 50);
        aboutBack.borderWidth = 2;
        aboutBack.borderColor = Color.WHITE;
        aboutBack.backgroundColor = Color.TRANSPARENT;
        aboutBack.onClickEventId = MenuEvents.MAIN_MENU;
    }

    initLevels() {
        let center = this.viewport.getCenter();
        this.levels = this.addUILayer(MenuLayers.LEVELS);
        this.levels.setHidden(true);

        const levelsHeader = <Label>this.add.uiElement(UIElementType.LABEL, MenuLayers.LEVELS, {position: new Vec2(center.x, center.y - 300), text: "Levels"});
        levelsHeader.textColor = Color.WHITE;

        const levelsBack = this.add.uiElement(UIElementType.BUTTON, MenuLayers.LEVELS, {position: new Vec2(125, 100), text: "Back"});
        levelsBack.size.set(100, 50);
        levelsBack.borderWidth = 2;
        levelsBack.borderColor = Color.WHITE;
        levelsBack.backgroundColor = Color.TRANSPARENT;
        levelsBack.onClickEventId = MenuEvents.MAIN_MENU;
    }

    unloadScene() {
        this.emitter.fireEvent(GameEventType.STOP_SOUND, {key: "menu"});
    }
}
