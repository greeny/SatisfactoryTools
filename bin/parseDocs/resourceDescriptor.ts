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
		result.push({
			item: descriptor.ClassName,
			pingColor: parseColor(Strings.unserializeDocs(descriptor.mPingColor)),
			speed: parseFloat(descriptor.mCollectSpeedMultiplier),
		});
	}
	return result;
}
