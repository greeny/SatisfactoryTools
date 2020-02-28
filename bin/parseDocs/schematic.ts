import {ISchematicSchema} from '@src/Schema/ISchematicSchema';
import {Arrays} from '@src/Utils/Arrays';
import {Strings} from '@src/Utils/Strings';
import parseBlueprintClass from '@bin/parseDocs/blueprintClass';
import parseItemAmount from '@bin/parseDocs/itemAmount';

export default function parseSchematics(schematics: {
	ClassName: string,
	mType: string,
	mTechTier: string,
	mDisplayName: string,
	mCost: string,
	mUnlocks: string,
	mTimeToComplete: string
}[]): ISchematicSchema[]
{
	const result: ISchematicSchema[] = [];
	for (const schematic of schematics) {
		result.push({
			className: schematic.ClassName,
			name: schematic.mDisplayName,
			tier: parseInt(schematic.mTechTier),
			cost: schematic.mCost ? Arrays.ensureArray(Strings.unserializeDocs(schematic.mCost)).map(parseItemAmount) : [],
			unlock: schematic.mUnlocks ? Arrays.ensureArray(Strings.unserializeDocs(schematic.mUnlocks)).map(parseBlueprintClass) : [],
			type: schematic.mType,
			time: parseFloat(schematic.mTimeToComplete),
			alternate: false,
			mam: false,
		});
	}
	return result;
}
