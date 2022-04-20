/**
 * This class will represent a store in the game. The store will have an array of
 * store items that will be retrieved from the item registry. The items should will
 * need to have a format similar to the following:
 * 
 * storeItem = {
 *      spriteKey: string,
 *      cost: number, 
 *      name: string,
 *      buffs: Array<buff>
 * }
 * 
 * buff = {
 *      type: string,
 *      scale: number
 * }
 */
export default class StoreItems {

    private items: Array<Record<string,any>>;

    public constructor(items: Array<Record<string,any>>) {
        this.items = items;
    }

    setItems(items: Array<Record<string,any>>): void {
        this.items = items;
    }

    getItems(): Array<Record<string,any>> {
        return this.items;
    }

    /**
     * This method will get and return a bunch of random items
     * from the store registry.
     */
    static getRandomItems(): Array<Record<string,any>> {
        return;
    }

}