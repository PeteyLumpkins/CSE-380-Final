/** 
 * Data format for items in the store:
 * [
 *      {key: string, count: number},
 *      {key: string, count: number},
 *      {key: string, count: number}
 *      ...
 * ]
 * 
 * key: the item key in the store-data files
 * count: the number of this item in the store
 */
export default class StoreItems {

    items: Array<Record<string, any>>;

    constructor(items: Array<Record<string,any>>) {
        this.items = items;
    }

    // Gets a copy of the item at the given index
    getItem(index: number) {
        return JSON.parse(JSON.stringify(this.items[index]));
    }

    // Adds 1 to the count of an item in the store
    addItem(index: number) {
        this.items[index].count += 1;
    }

    // Subtracts 1 from the count of an item in the store
    removeItem(index: number) {
        if (this.items[index].count > 0) {
            console.log("Removing item from the store!");
            this.items[index].count -= 1;
        }
    }

    // Should return a copy of the items in the store and their counts
    getItemsCopy(): Record<string,number> {
        return JSON.parse(JSON.stringify(this.items));
    }

}