import {ISchematicSchema, ISchematicUnlockSchema} from '@src/Schema/ISchematicSchema';
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
	mUnlocks: {
		mRecipes?: string;
		mResourcesToAddToScanner?: string;
		mNumInventorySlotsToUnlock?: string;
	}[],
	mSchematicDependencies: {
		mSchematics?: string;
		mRequireAllSchematicsToBePurchased?: string;
	}[],
	mTimeToComplete: string
}[]): ISchematicSchema[]
{
	const result: ISchematicSchema[] = [];
	for (const schematic of schematics) {
		const requiredSchematics: string[] = [];
		const unlockData: ISchematicUnlockSchema = {
			inventorySlots: 0,
			recipes: [],
			scannerResources: [],
		};

		for (const unlock of schematic.mUnlocks) {
			if (unlock.mNumInventorySlotsToUnlock) {
				unlockData.inventorySlots += parseInt(unlock.mNumInventorySlotsToUnlock);
			}
			if (unlock.mRecipes) {
				unlockData.recipes.push(...Arrays.ensureArray(Strings.unserializeDocs(unlock.mRecipes)).map(parseBlueprintClass));
			}
			if (unlock.mResourcesToAddToScanner) {
				unlockData.scannerResources.push(...Arrays.ensureArray(Strings.unserializeDocs(unlock.mResourcesToAddToScanner)).map(parseBlueprintClass));
			}
		}

		result.push({
			className: schematic.ClassName,
			name: schematic.mDisplayName,
			tier: parseInt(schematic.mTechTier),
			cost: schematic.mCost ? Arrays.ensureArray(Strings.unserializeDocs(schematic.mCost)).map(parseItemAmount) : [],
			unlock: unlockData,
			requiredSchematics: requiredSchematics,
			type: schematic.mType,
			time: parseFloat(schematic.mTimeToComplete),
			alternate: false,
			mam: false,
		});
	}
	return result;
}
