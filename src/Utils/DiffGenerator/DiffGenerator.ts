import {IJsonSchema} from '@src/Schema/IJsonSchema';
import {IDiffSchema} from '@src/Utils/DiffGenerator/IDiffSchema';

export class DiffGenerator
{

	private diff: IDiffSchema[] = [];

	public generateDiff(originalSchema: IJsonSchema, newSchema: IJsonSchema): IDiffSchema[]
	{
		this.diff = [];

		for (const key in originalSchema.items) {
			this.checkForRemoved(originalSchema.items[key], newSchema.items[key], originalSchema.items[key].name, 'item');
		}
		for (const key in originalSchema.recipes) {
			this.checkForRemoved(originalSchema.recipes[key], newSchema.recipes[key], originalSchema.recipes[key].name, 'recipe');
		}

		for (const key in newSchema.items) {
			this.checkForAdded(originalSchema.items[key], newSchema.items[key], newSchema.items[key].name, 'item');
		}
		for (const key in newSchema.recipes) {
			this.checkForAdded(originalSchema.recipes[key], newSchema.recipes[key], newSchema.recipes[key].name, 'recipe');
		}

		return this.diff;
	}

	private checkForRemoved(originalItem: any, newItem: any, name: string, type: string): void
	{
		if (originalItem && !newItem) {
			this.diff.push({
				name: null,
				changes: [
					'Removed ' + type + ': ' + name,
				],
			});
		}
	}

	private checkForAdded(originalItem: any, newItem: any, name: string, type: string): void
	{
		if (!originalItem && newItem) {
			this.diff.push({
				name: null,
				changes: [
					'Added new ' + type + ': ' + name,
				],
			});
		}
	}

}
