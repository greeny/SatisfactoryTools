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
}[])
{
	const result: IItemSchema[] = [];
	for (const item of items) {
		result.push({
			slug: Strings.webalize(item.mDisplayName),
			className: item.ClassName,
			name: item.mDisplayName,
			sinkPoints: 0, // filled elsewhere
			description: item.mDescription.replace(/\r\n/ig, '\n'),
			stackSize: Strings.stackSizeFromEnum(item.mStackSize),
			energyValue: parseFloat(item.mEnergyValue),
			radioactiveDecay: parseFloat(item.mRadioactiveDecay),
			liquid: item.mForm === 'RF_LIQUID',
			fluidColor: parseColor(Strings.unserializeDocs(item.mFluidColor)),
		});
	}
	return result;
}
