import Registry from "../../Wolfie2D/Registry/Registries/Registry";
import ResourceManager from "../../Wolfie2D/ResourceManager/ResourceManager";
import { ItemSprites } from "../GameEnums";
import Item from "../Items/Item";

export default class ItemRegistry extends Registry<Item>{
    public preload(): void{

        let rm = ResourceManager.getInstance(); 
        
    }
    
    //Unused:
    public registerAndPreloadItem(key: string): void {
        let rm = ResourceManager.getInstance();

        console.log('Trying to load item meta data');
        console.log(rm.getObject("item-meta"));
    }

    //Used to register an item into the registry
    public registerItem(key: string, item:Item): void {
        this.add(key, item); //don't know if this works
    }

    //Returns a random item within this registry:
    public getRandomItem():Item{ 
        //trying to think of a good way to do this, currently I think we can get a random index from the json and return that.
        let rm=ResourceManager.getInstance();
        rm.object("itemData", "assets/data/items copy.json");
        let itemData=rm.getObject("itemData");
        let max = itemData.numItems;
        let num = Math.floor(Math.random()*max);
        return this.get(itemData.items[num]);
    }
}

