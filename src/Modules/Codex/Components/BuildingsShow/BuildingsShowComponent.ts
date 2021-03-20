import {Component} from '@angular/core';
import {ActivatedRoute} from '@angular/router';
import {DataService} from '@modules/Codex/Service';
import {RecipesDataProvider, SchematicsDataProvider} from '@modules/Codex/Service/DataProvider';
import {Constants, RESOURCE_PURITY} from '@src/Constants';
import {Formula} from '@src/Formula';
import {IBuildingSchema} from '@src/Schema/IBuildingSchema';
import {IGeneratorSchema} from '@src/Schema/IGeneratorSchema';
import {IItemSchema} from '@src/Schema/IItemSchema';
import {IMinerSchema} from '@src/Schema/IMinerSchema';
import {IRecipeSchema} from '@src/Schema/IRecipeSchema';
import {BehaviorSubject, identity, Observable} from 'rxjs';
import {concatMap, filter, map, switchMap, tap, withLatestFrom} from 'rxjs/operators';

@Component({
	selector:    'sf-codex-building-show',
	templateUrl: './BuildingsShowComponent.html'
})
export class BuildingsShowComponent
{
	public readonly building$: Observable<IBuildingSchema>;
	public readonly recipe$: Observable<IRecipeSchema>;
	public readonly recipes$: Observable<IRecipeSchema[]>;
	public overclock = 100;
	public readonly overclock$ = new BehaviorSubject<number>(this.overclock);
	public readonly purity$ = new BehaviorSubject<RESOURCE_PURITY>('normal');

	public readonly purities: Array<RESOURCE_PURITY> = [
		'impure',
		'normal',
		'pure'
	];

	constructor(
		private activatedRoute: ActivatedRoute,
		private recipesProvider: RecipesDataProvider,
		private schematicProvider: SchematicsDataProvider,
		private dataService: DataService
	)
	{
		this.building$ = this.activatedRoute.data.pipe(
			map(data => {
				return data.entity;
			})
		);

		this.recipe$ = this.building$.pipe(
			switchMap(building => {
				return this.recipesProvider.getAll().pipe(
					concatMap(identity),
					filter((recipe: IRecipeSchema) => {
						return recipe.products.filter(p => p.item === building.className).length > 0;
					})
				);
			})
		);

		this.recipes$ = this.building$.pipe(
			switchMap(building => {
				return this.recipesProvider.getAll().pipe(
					// concatMap(identity),
					map(recipes => {
						return recipes.filter((recipe: IRecipeSchema) => {
							if (Constants.WORKSHOP_CLASSNAME === building.className) {
								return recipe.inWorkshop;
							}

							if (Constants.WORKBENCH_CLASSNAME === building.className) {
								return recipe.inHand;
							}

							return -1 !== recipe.producedIn.indexOf(building.className);
						});
					})
				);
			})
		);
	}

	public isBuilding(entity: IBuildingSchema): boolean
	{
		return this.dataService.getData().isBuilding(entity);
	}

	public isPowerConsumingBuilding(entity: IBuildingSchema): boolean
	{
		return false === this.isGeneratorBuilding(entity) && 'powerConsumption' in entity.metadata;
	}

	public isGeneratorBuilding(entity: IBuildingSchema): boolean
	{
		return this.dataService.getData().isGeneratorBuilding(entity);
	}

	public isManualManufacturer(entity: IBuildingSchema): boolean
	{
		return this.dataService.getData().isManualManufacturer(entity);
	}

	public isAutomatedManufacturer(entity: IBuildingSchema): boolean
	{
		return (this.isManufacturerBuilding(entity) && false === this.isManualManufacturer(entity)) || true === this.isExtractorBuilding(entity);
	}

	public isManufacturerBuilding(entity: IBuildingSchema): boolean
	{
		return this.dataService.getData().isManufacturerBuilding(entity);
	}

	public isExtractorBuilding(entity: IBuildingSchema): boolean
	{
		return this.dataService.getData().isExtractorBuilding(entity);
	}

	public isConveyorBuilding(entity: IBuildingSchema): boolean
	{
		return 'beltSpeed' in entity.metadata;
	}

	public getGenerator(entity: IBuildingSchema): IGeneratorSchema
	{
		return this.dataService.getData().getRawData().generators[entity.className.replace('Desc', 'Build')];
	}

	public getExtractor(entity: IBuildingSchema): IMinerSchema
	{
		return this.dataService.getData().getRawData().miners[entity.className.replace('Desc', 'Build')];
	}

	public getExtractionRate(extractor: IMinerSchema): Observable<number>
	{
		return this.overclock$.pipe(
			withLatestFrom(this.purity$),
			map(([overclockValue, purity]) => {
				return Formula.calculateExtractorExtractionValue(extractor, purity) * (overclockValue / 100);
			})
		);
	}

	public powerProduction(entity: IGeneratorSchema): Observable<number>
	{
		return this.overclock$.pipe(
			map(overclockValue => Formula.calculatePowerGeneratorPowerCapacity(entity, overclockValue))
		);
	}

	public powerConsumption(entity: IBuildingSchema): Observable<number>
	{
		return this.overclock$.pipe(
			map(overclockValue => Formula.calculateBuildingPowerConsumption(entity, overclockValue))
		);
	}

	public fuelConsumption(entity: IGeneratorSchema, item: string): Observable<number>
	{
		return this.overclock$.pipe(
			map(overclockValue => Formula.calculateFuelConsumption(entity, this.dataService.getData().getRawData().items[item], overclockValue))
		);
	}

	public getWater(): IItemSchema
	{
		return this.dataService.getData().getRawData().items[Constants.WATER_CLASSNAME];
	}

	public waterConsumption(entity: IGeneratorSchema): Observable<number>
	{
		return this.overclock$.pipe(
			map(overclockValue => Formula.calculateGeneratorWaterConsumption(entity, overclockValue))
		);
	}
}
