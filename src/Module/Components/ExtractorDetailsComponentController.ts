import {IBuildingSchema} from '@src/Schema/IBuildingSchema';
import {IMinerSchema} from '@src/Schema/IMinerSchema';
import data from '@src/Data/Data';
import {Constants} from '@src/Constants';

export class ExtractorDetailsComponentController
{
	public building: IBuildingSchema;

	public getExtractor(className: string): IMinerSchema
	{
		return data.getRawData().miners[className.replace('Desc', 'Build')];
	}

	public getExtractionValues(building: IBuildingSchema, extractor: IMinerSchema, purity: 'impure'|'normal'|'pure'): number
	{
		const extractorMultiplier = Constants.WATER_EXTRACTOR_CLASSNAME === building.className ? 0 : 1;
		const extractedValue = (60 / extractor.extractCycleTime) * (extractor.itemsPerCycle / (extractor.allowLiquids ? 1000 : 1));
		switch (purity) {
			case 'impure':
				return extractedValue * Constants.RESOURCE_MULTIPLIER_IMPURE * extractorMultiplier;
			case 'normal':
				return extractedValue * Constants.RESOURCE_MULTIPLIER_NORMAL;
			case 'pure':
				return extractedValue * Constants.RESOURCE_MULTIPLIER_PURE * extractorMultiplier;
		}
	}
}
