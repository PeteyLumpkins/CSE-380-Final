export enum GameLayers {
    PRIMARY = "PRIMARY_LAYER",
    UI = "UI_LAYER",
    LEVEL = "LEVEL_LAYER", 
    PAUSED = "PAUSED_LAYER",
    CONTROLS = "CONTROLS_LAYER",
    STORE_BG = "STORE_BG_LAYER",
    STORE_CONTROLS = "STORE_CONTROLS_LAYER",
    STORE_ITEMS = "STORE_ITEMS_LAYER"
}

export enum GameSprites {
    PLAYER = "GAME_SPRITE_PLAYER",
    STORE_BG = "GAME_SPRITE_STORE_BG",
    STORE = "GAME_SPRITE_STORE"
}

export enum GameEvents {
    PAUSE = "PAUSE_EVENT",
    RESUME = "RESUME_EVENT",
    CONTROLS = "CONTROLS_EVENT",
    MAIN_MENU = "MAIN_MENU_EVENT",
    OPEN_STORE = "OPEN_STORE_EVENT",
    CLOSE_STORE = "CLOSE_STORE_EVENT"
}


export enum Homework3Animations {
	CAR_IDLE = "idle",
	CAR_DRIVE = "driving",
	CAR_DAMAGE = "damage",
	CAR_DYRING = "dying", 
	CAR_DEAD = "dead", 
	CAR_FIRING = "firing"
}

export enum MenuLayers {
    SPLASH = "MENU_SPLASH_LAYER", 
    MAIN_MENU = "MENU_MAIN_MENU_LAYER",
    CONTROLS= "MENU_CONTROLS_LAYER",
    HELP = "MENU_HELP_SCREEN",
    LEVELS = "MENU_LEVELS_LAYER",
    BACKGROUND = "MENU_BACKGROUND_LAYER",
    LOGO = "MENU_LOGO_LAYER"
}

export enum MenuImages {
    BACKGROUND = "MENU_BACKGROUND_IMAGE",
    LOGO = "MENU_LOGO_IMAGE"
}

export enum MenuEvents {
    PLAY_GAME = "MENU_PLAY_GAME_EVENT",
    SPLASH = "MENU_SPLASH_EVENT", 
    MAIN_MENU = "MENU_MAIN_MENU_EVENT",
    CONTROLS = "MENU_CONTROLS_EVENT",
    HELP = "MENU_HELP_EVENT",
    LEVELS = "MENU_LEVELS_EVENT"
}