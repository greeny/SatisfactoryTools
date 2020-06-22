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
		Class?: string;
		mSchematics?: string;
		mRequireAllSchematicsToBePurchased?: string;
	}[],
	mTimeToComplete: string
}[]): ISchematicSchema[]
{
	const result: ISchematicSchema[] = [];
	for (const schematic of schematics) {
		// ignore resource sink purchases and custom schematics
		if (schematic.mType === 'EST_ResourceSink' || schematic.mType === 'EST_Custom') {
			continue;
		}

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

		for (const requirement of schematic.mSchematicDependencies) {
			if (requirement.Class === 'BP_SchematicPurchasedDependency_C' && requirement.mSchematics) {
				requiredSchematics.push(...Arrays.ensureArray(Strings.unserializeDocs(requirement.mSchematics)).map(parseBlueprintClass));
			}
		}

		const cost = schematic.mCost ? Arrays.ensureArray(Strings.unserializeDocs(schematic.mCost)).map(parseItemAmount) : [];
		let slug = Strings.webalize(schematic.mDisplayName);
		// add suffix to slug to prevent duplicates
		if ((schematic.mDisplayName === 'Inflated Pocket Dimension' || schematic.mDisplayName === 'Medicinal Inhaler') && cost.length) {
			slug += '-' + Strings.webalize(cost[0].item.replace('Desc_', '').replace('_C', ''));
		}

		result.push({
			className: schematic.ClassName,
			name: schematic.mDisplayName,
			slug: slug,
			tier: parseInt(schematic.mTechTier),
			cost: cost,
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
