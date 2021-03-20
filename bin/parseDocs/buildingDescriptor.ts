import {Strings} from '@src/Utils/Strings';
import {Arrays} from '@src/Utils/Arrays';
import parseBlueprintClass from '@bin/parseDocs/blueprintClass';

export default function parseBuildingDescriptors(buildingDescriptors: {
	ClassName: string,
	mSubCategories: string,
	mBuildMenuPriority: string,
}[]): IBuildingDescriptor[]
{
	const result: IBuildingDescriptor[] = [];
	for (const buildingDescriptor of buildingDescriptors) {
		result.push({
			className: buildingDescriptor.ClassName,
			categories: Arrays.ensureArray(Strings.unserializeDocs(buildingDescriptor.mSubCategories)).map(parseBlueprintClass),
			priority: parseFloat(buildingDescriptor.mBuildMenuPriority),
		});
	}
	return result;
}

interface IBuildingDescriptor {

	className: string;
	categories: string[];
	priority: number;

}
