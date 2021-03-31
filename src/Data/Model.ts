import rawData from '@data/data.json';
import rawAprilData from '@data/aprilData.json';
import {IJsonSchema} from '@src/Schema/IJsonSchema';
import {Item} from '@src/Data/Item';
import {Recipe} from '@src/Data/Recipe';
import {IMinerSchema} from '@src/Schema/IMinerSchema';
import {IItemSchema} from '@src/Schema/IItemSchema';
import {April} from '@src/Utils/April';

export class Model
{

	public items: {[key: string]: Item} = {};
	public recipes: {[key: string]: Recipe} = {};

	public constructor(public readonly data: IJsonSchema)
	{
		for (const k in data.items) {
			if (data.items.hasOwnProperty(k)) {
				this.items[k] = new Item(this, data.items[k]);
			}
		}
		for (const k in data.recipes) {
			if (data.recipes.hasOwnProperty(k)) {
				const recipe = data.recipes[k];
				if (recipe.inHand || recipe.inMachine || recipe.inWorkshop) {
					this.recipes[k] = new Recipe(this, recipe);
				}
			}
		}
	}

	public getItem(className: string): Item
	{
		if (className in this.items) {
			return this.items[className];
		}
		throw new Error('Unknown item ' + className);
	}

	public getAutomatableItems(): IItemSchema[]
	{
		const items: Item[] = [];
		itemLoop:
		for (const k in this.items) {
			if (this.items.hasOwnProperty(k)) {
				for (const l in this.recipes) {
					if (this.recipes.hasOwnProperty(l) && this.recipes[l].prototype.inMachine) {
						for (const product of this.recipes[l].products) {
							if (product.item === this.items[k]) {
								items.push(this.items[k]);
								continue itemLoop;
							}
						}
					}
				}
			}
		}
		return items.sort((item1: Item, item2: Item) => {
			return item1.prototype.name.localeCompare(item2.prototype.name);
		}).map((item: Item) => {
			return item.prototype;
		});
	}

	public getInputableItems(): IItemSchema[]
	{
		return this.getAutomatableItems().filter((item) => {
			return !(item.className in this.data.resources);
		});
	}

	public isRawResource(item: Item): boolean
	{
		return item.prototype.className in this.data.resources;
	}

	public getResourceMiners(item: Item): IMinerSchema[]
	{
		const result: IMinerSchema[] = [];
		for (const k in this.data.miners) {
			if (this.data.miners.hasOwnProperty(k)) {
				const miner = this.data.miners[k];
				if (miner.allowedResources.length === 0) {
					if ((miner.allowLiquids && item.prototype.liquid) || (miner.allowSolids && !item.prototype.liquid)) {
						result.push(miner);
					}
				} else if (miner.allowedResources.indexOf(item.prototype.className) !== -1) {
					result.push(miner);
				}
			}
		}
		return result;
	}

}

export default new Model(April.isApril() ? rawAprilData as any : rawData as any);
