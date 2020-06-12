import {IBuildingSchema} from '@src/Schema/IBuildingSchema';
import {IMinerSchema} from '@src/Schema/IMinerSchema';
import data from '@src/Data/Data';
import {IItemSchema} from '@src/Schema/IItemSchema';
import {IOnInit} from 'angular';

export class ExtractorResourcesComponentController implements IOnInit
{
	public building: IBuildingSchema;
	public extractor: IMinerSchema;
	public resources: IItemSchema[];

	public $onInit(): void
	{
		this.extractor = data.getRawData().miners[this.building.className.replace('Desc', 'Build')];
		this.resources = this.extractor.allowedResources.map((resource: string) => {
			return data.getRawData().items[resource];
		});
	}
}
