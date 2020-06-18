import {IBuildingSchema} from '@src/Schema/IBuildingSchema';
import {IGeneratorSchema} from '@src/Schema/IGeneratorSchema';
import data from '@src/Data/Data';

export class GeneratorDetailsComponentController
{

	public building: IBuildingSchema;
	public overclock: number = 100;

	public get generator(): IGeneratorSchema
	{
		return this.getGenerator(this.building.className);
	}

	public get powerProduction(): number|undefined
	{
		return this.generator.powerProduction * Math.pow(this.overclock / 100, 1 / this.generator.powerProductionExponent);
	}

	public getGenerator(className: string): IGeneratorSchema
	{
		return data.getRawData().generators[className.replace('Desc', 'Build')];
	}

}
