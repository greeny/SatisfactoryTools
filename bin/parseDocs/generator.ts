import {Arrays} from '@src/Utils/Arrays';
import {Strings} from '@src/Utils/Strings';
import parseBlueprintClass from '@bin/parseDocs/blueprintClass';
import {IGeneratorSchema} from '@src/Schema/IGeneratorSchema';

export default function parseGenerators(generators: {
	ClassName: string,
	mDefaultFuelClasses: string,
	mPowerProduction: string,
	mPowerProductionExponent: string,
	mSupplementalToPowerRatio?: string,
}[]): IGeneratorSchema[]
{
	const result: IGeneratorSchema[] = [];
	for (const generator of generators) {
		result.push({
			className: generator.ClassName,
			fuel: Arrays.ensureArray(Strings.unserializeDocs(generator.mDefaultFuelClasses || '()')).map(parseBlueprintClass),
			powerProduction: parseFloat(generator.mPowerProduction),
			powerProductionExponent: parseFloat(generator.mPowerProductionExponent),
			waterToPowerRatio: parseFloat(generator.mSupplementalToPowerRatio || '0'),
		});
	}
	return result;
}
