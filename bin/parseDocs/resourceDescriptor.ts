import parseColor from '@bin/parseDocs/color';
import {Strings} from '@src/Utils/Strings';
import {IResourceSchema} from '@src/Schema/IResourceSchema';

export default function parseResourceDescriptors(descriptors: {
	ClassName: string,
	mDecalSize: string,
	mPingColor: string,
	mCollectSpeedMultiplier: string,
	mManualMiningAudioName: string,
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
}[]): IResourceSchema[]
{
	const result = [];
	for (const descriptor of descriptors) {
		switch (descriptor.ClassName) {
			// ignore non-resource entries
			case 'Desc_UraniumCell_C':
			case 'Desc_UraniumPellet_C':
			case 'Desc_CompactedCoal_C':
			case 'Desc_PackagedOil_C':
			case 'Desc_PackagedWater_C':
				continue;
			default:
				result.push({
					item: descriptor.ClassName,
					pingColor: parseColor(Strings.unserializeDocs(descriptor.mPingColor), true),
					speed: parseFloat(descriptor.mCollectSpeedMultiplier),
				});
		}
	}
	return result;
}
