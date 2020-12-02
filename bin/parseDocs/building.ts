import {Strings} from '@src/Utils/Strings';
import {IBuildingSchema} from '@src/Schema/IBuildingSchema';
import {IBuildingMetadataSchema} from '@src/Schema/IBuildingMetadataSchema';

export default function parseBuildings(buildings: {
	ClassName: string,
	mDisplayName: string,
	mDescription: string,
	mSpeed?: string,
	mLengthPerCost?: string,
	mMaxLength?: string,
	mManufacturingSpeed?: string,
	mPowerConsumption?: string,
	mPowerConsumptionExponent?: string,
	mInventorySizeX?: string,
	mInventorySizeY?: string,
	mFlowLimit?: string,
	mDesignPressure?: string,
	mStorageCapacity?: string,
}[], fixClassName: boolean = false): IBuildingSchema[]
{
	const ignored = [
		'Build_JumpPadTilted_C',
		'Build_JumpPad_C',
		'Build_Stair_1b_C',
	];

	const result: IBuildingSchema[] = [];
	for (const building of buildings) {
		if (ignored.indexOf(building.ClassName) !== -1) {
			continue;
		}

		const metadata: IBuildingMetadataSchema = {};

		if (typeof building.mSpeed !== 'undefined') {
			metadata.beltSpeed = parseFloat(building.mSpeed) / 2;
			metadata.firstPieceCostMultiplier = 1;
			metadata.lengthPerCost = 200; // belts don't have lengthPerCost attribute, but they build two meters per cost
			metadata.maxLength = 4900; // belts don't have maxLength attribute, but they have max length of 49 meters
		}

		if (typeof building.mLengthPerCost !== 'undefined') {
			metadata.lengthPerCost = parseFloat(building.mLengthPerCost);
			metadata.firstPieceCostMultiplier = 1;
		}

		if (typeof building.mMaxLength !== 'undefined') {
			metadata.maxLength = parseFloat(building.mMaxLength);
		}

		if (typeof building.mPowerConsumption !== 'undefined') {
			metadata.powerConsumption = parseFloat(building.mPowerConsumption);
		}

		if (typeof building.mPowerConsumptionExponent !== 'undefined') {
			metadata.powerConsumptionExponent = parseFloat(building.mPowerConsumptionExponent);
		}

		if (typeof building.mManufacturingSpeed !== 'undefined') {
			metadata.manufacturingSpeed = parseFloat(building.mManufacturingSpeed);
		}

		if (typeof building.mInventorySizeX !== 'undefined' && typeof building.mInventorySizeY !== 'undefined') {
			metadata.inventorySize = parseInt(building.mInventorySizeX) * parseInt(building.mInventorySizeY);
		}

		if (typeof building.mFlowLimit !== 'undefined') {
			metadata.flowLimit = parseFloat(building.mFlowLimit);
		}

		if (typeof building.mDesignPressure !== 'undefined') {
			metadata.maxPressure = parseFloat(building.mDesignPressure);
		}

		if (typeof building.mStorageCapacity !== 'undefined') {
			metadata.storageCapacity = parseFloat(building.mStorageCapacity);
		}

		if (building.ClassName === 'Desc_RailroadTrack_C') {
			metadata.firstPieceCostMultiplier = 2;
			metadata.lengthPerCost = 12;
		} else if (building.ClassName === 'Build_WalkwayTrun_C') { // nice typo CSS
			building.ClassName = 'Desc_WalkwayTurn_C';
		}

		let slug = Strings.webalize(building.mDisplayName);
		if (building.ClassName.match(/Steel/) || building.ClassName === 'Build_Wall_8x4_02_C') {
			slug += '-steel';
		}

		result.push({
			slug: slug,
			name: building.mDisplayName,
			description: building.mDescription.replace(/\r\n/ig, '\n'),
			categories: [],
			buildMenuPriority: 0,
			className: fixClassName ? building.ClassName.replace('Build_', 'Desc_') : building.ClassName,
			metadata: metadata,
		});
	}
	return result;
}
