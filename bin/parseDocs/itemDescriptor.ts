import {IItemSchema} from '@src/Schema/IItemSchema';
import {Strings} from '@src/Utils/Strings';
import parseColor from '@bin/parseDocs/color';

export default function parseItemDescriptors(items: {
	ClassName: string,
	mDisplayName: string,
	mDescription: string,
	mStackSize: string,
	mCanBeDiscarded: string,
	mRememberPickUp: string,
	mEnergyValue: string,
	mRadioactiveDecay: string,
	mResourceSinkPoints: string,
	mForm: string,
	mFluidDensity: string,
	mFluidViscosity: string,
	mFluidFriction: string,
	mFluidColor: string,
	mPersistentBigIcon: string,
}[])
{
	const result: IItemSchema[] = [];
	for (const item of items) {
		const ignored = [
			'BP_EquipmentDescriptorCandyCane_C',
			'BP_EquipmentDescriptorSnowballMittens_C',
			'Desc_CandyCane_C',
			'Desc_Gift_C',
			'Desc_Snow_C',
			'Desc_SnowballProjectile_C',
			'Desc_XmasBall1_C',
			'Desc_XmasBall2_C',
			'Desc_XmasBall3_C',
			'Desc_XmasBall4_C',
			'Desc_XmasBallCluster_C',
			'Desc_XmasBow_C',
			'Desc_XmasBranch_C',
			'Desc_XmasStar_C',
			'Desc_XmasWreath_C',
			'Desc_CandyCaneDecor_C',
			'Desc_Snowman_C',
			'Desc_WreathDecor_C',
			'Desc_XmassTree_C',
		];

		if (ignored.indexOf(item.ClassName) !== -1) {
			continue;
		}

		if (item.mPersistentBigIcon !== 'None') {
			result.push({
				slug: Strings.webalize(item.mDisplayName),
				className: item.ClassName,
				name: item.mDisplayName,
				sinkPoints: parseInt(item.mResourceSinkPoints),
				description: item.mDescription.replace(/\r\n/ig, '\n'),
				stackSize: Strings.stackSizeFromEnum(item.mStackSize),
				energyValue: parseFloat(item.mEnergyValue),
				radioactiveDecay: parseFloat(item.mRadioactiveDecay),
				liquid: item.mForm === 'RF_LIQUID',
				fluidColor: parseColor(Strings.unserializeDocs(item.mFluidColor)),
			});
		}
	}
	return result;
}
