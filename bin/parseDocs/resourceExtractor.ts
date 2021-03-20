import {IMinerSchema} from '@src/Schema/IMinerSchema';
import {Arrays} from '@src/Utils/Arrays';
import {Strings} from '@src/Utils/Strings';
import parseBlueprintClass from '@bin/parseDocs/blueprintClass';

export default function parseResourceExtractors(resourceExtractors: {
	ClassName: string,
	mAllowedResources: string,
	mAllowedResourceForms: string,
	mItemsPerCycle: string,
	mExtractCycleTime: string,
}[]): IMinerSchema[]
{
	const result: IMinerSchema[] = [];
	for (const resourceExtractor of resourceExtractors) {
		const allowedResourceForms = Strings.unserializeDocs(resourceExtractor.mAllowedResourceForms);
		let allowLiquids = false;
		let allowSolids = false;

		for (const form of allowedResourceForms) {
			if (form === 'RF_LIQUID') {
				allowLiquids = true;
			} else if (form === 'RF_SOLID') {
				allowSolids = true;
			}
		}

		const minerSchema: IMinerSchema = {
			className: resourceExtractor.ClassName,
			allowedResources: [],
			itemsPerCycle: parseFloat(resourceExtractor.mItemsPerCycle),
			extractCycleTime: parseFloat(resourceExtractor.mExtractCycleTime),
			allowLiquids: allowLiquids,
			allowSolids: allowSolids,
		};
		const allowedResources = Strings.unserializeDocs(resourceExtractor.mAllowedResources);

		if (allowedResources !== null) {
			minerSchema.allowedResources = Arrays.ensureArray(allowedResources).map(parseBlueprintClass);
		}

		result.push(minerSchema);
	}
	return result;
}
