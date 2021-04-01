import {ILocationProvider, IModule, ISCEProvider, IScope} from 'angular';
import {StateParams, UrlRouterProvider} from 'angular-ui-router';
import {HomeController} from '@src/Module/Controllers/HomeController';
import {AppDirective} from '@src/Module/Directives/AppDirective';
import {ItemController} from '@src/Module/Controllers/ItemController';
import {ItemIconDirective} from '@src/Module/Directives/ItemIconDirective';
import {RecentlyVisitedItemsService} from '@src/Module/Services/RecentlyVisitedItemsService';
import {ProductionController} from '@src/Module/Controllers/ProductionController';
import {VisualizationComponent} from '@src/Module/Components/VisualizationComponent';
import {ItemFilterComponent} from '@src/Module/Components/ItemFilterComponent';
import {ItemFiltersService} from '@src/Module/Services/ItemFiltersService';
import {ApplicationBreadcrumbsComponent} from '@src/Module/Components/ApplicationBreadcrumbsComponent';
import {EntityListingComponent} from '@src/Module/Components/EntityListingComponent';
import {IAppState, IAppStateProvider} from '@src/Types/IAppStateProvider';
import data from '@src/Data/Data';
import {BuildingFiltersService} from '@src/Module/Services/BuildingFiltersService';
import {CodexComponent} from '@src/Module/Components/CodexComponent';
import {BuildingFilterComponent} from '@src/Module/Components/BuildingFilterComponent';
import {PerfectScrollbarDirective} from '@src/Module/Directives/PerfectScrollbarDirective';
import {LazyLoadDirective} from '@src/Module/Directives/LazyLoadDirective';
import {DataStorageService} from '@src/Module/Services/DataStorageService';
import {BuildingController} from '@src/Module/Controllers/BuildingController';
import {RecipesTableComponent} from '@src/Module/Components/RecipesTableComponent';
import {ManufacturerDetailsComponent} from '@src/Module/Components/ManufacturerDetailsComponent';
import {ExtractorDetailsComponent} from '@src/Module/Components/ExtractorDetailsComponent';
import {GeneratorDetailsComponent} from '@src/Module/Components/GeneratorDetailsComponent';
import {OtherBuildingsDetailsComponent} from '@src/Module/Components/OtherBuildingsDetailsComponent';
import {IBuildingSchema} from '@src/Schema/IBuildingSchema';
import {ITransitionObject} from '@src/Types/ITransitionObject';
import {IFilterService} from '@src/Types/IFilterService';
import {GeneratorFuelsComponent} from '@src/Module/Components/GeneratorFuelsComponent';
import {ExtractorResourcesComponent} from '@src/Module/Components/ExtractorResourcesComponent';
import {ManufacturerRecipesComponent} from '@src/Module/Components/ManufacturerRecipesComponent';
import {ComponentOptionsService} from '@src/Module/Services/ComponentOptionsService';
import {SchematicFiltersService} from '@src/Module/Services/SchematicFiltersService';
import {SchematicFilterComponent} from '@src/Module/Components/SchematicFilterComponent';
import {SchematicController} from '@src/Module/Controllers/SchematicController';
import {April} from '@src/Utils/April';

export class AppModule
{


	public constructor(private readonly app: IModule)
	{
	}

	public register(): void
	{
		this.app.config([
			'$locationProvider', '$stateProvider', '$urlRouterProvider', '$sceProvider',
			($locationProvider: ILocationProvider, $stateProvider: IAppStateProvider, $urlRouterProvider: UrlRouterProvider, $sceProvider: ISCEProvider) => {
			$locationProvider.html5Mode({
				enabled: true,
				requireBase: false,
			}).hashPrefix('!');

			$sceProvider.enabled(false);
			const appStates: IAppState[] = [
				{
					name: 'root',
					ncyBreadcrumb: {
						skip: true,
					},
					abstract: true,
					url: '',
					template: require('@templates/root.html'),
				},
				{
					name: 'page_content',
					ncyBreadcrumb: {
						skip: true,
					},
					abstract: true,
					url: '',
					parent: 'root',
					views: {
						'page_top@root': 'applicationBreadcrumbs',
					},
				},
				{
					name: 'listing',
					ncyBreadcrumb: {
						skip: true,
					},
					abstract: true,
					url: '',
					parent: 'page_content',
					views: {
						'page_content@root': 'entityListing',
					},
				},
				{
					name: 'home',
					url: '/',
					ncyBreadcrumb: {
						label: 'Satisfactory Tools',
					},
					parent: 'listing',
					views: {
						'content@listing': {
							controller: 'HomeController',
							controllerAs: 'ctrl',
							template: require('@templates/Controllers/home.html'),
						},
					},
				},
				{
					name: 'codex',
					url: '/codex',
					parent: 'listing',
					abstract: true,
					ncyBreadcrumb: {
						parent: 'home',
						label: 'Codex',
					},
				},
				{
					name: 'schematics',
					url: '/schematics',
					ncyBreadcrumb: {
						label: 'Schematics browser',
						parent: 'codex',
					},
					onRetain: ['$transition$', 'filterService', ($transition: any, filterService: IFilterService<any>) => {
						if ('schematic' === $transition.from().name) {
							filterService.resetFilters();
						}
					}],
					parent: 'codex',
					resolve: {
						filterService: ['SchematicFiltersService', (service: SchematicFiltersService) => {
							return service;
						}],
						entityPreviewState: [() => {
							return 'schematic';
						}],
					},
					views: {
						'content@listing': 'codex',
						'filters@listing': 'schematicFilter',
					},
				},
				{
					name: 'schematic',
					url: '/{item}',
					parent: 'schematics',
					ncyBreadcrumb: {
						parent: 'schematics',
					},
					onEnter: ['$stateParams', '$state$', 'ComponentOptionsService', ($stateParams: StateParams, $state$: IAppState, options: ComponentOptionsService) => {
						$state$.ncyBreadcrumb = $state$.ncyBreadcrumb || {};
						$state$.ncyBreadcrumb.label = data.getSchematicBySlug($stateParams.item)?.name;
						options.reset();
					}],
					onExit: ['ComponentOptionsService', (options: ComponentOptionsService) => {
						options.reset();
					}],
					resolve: {
						schematic: ['$transition$', ($transition$: ITransitionObject<{item: string}>) => {
							return data.getSchematicBySlug($transition$.params().item);
						}],
					},
					views: {
						'content@listing': {
							controller: 'SchematicController',
							controllerAs: 'ctrl',
							template: require('@templates/Controllers/schematic.html'),
						},
					},
				},
				{
					name: 'buildings',
					url: '/buildings',
					ncyBreadcrumb: {
						label: 'Buildings browser',
						parent: 'codex',
					},
					onRetain: ['$transition$', 'filterService', ($transition: any, filterService: IFilterService<any>) => {
						if ('building' === $transition.from().name) {
							filterService.resetFilters();
						}
					}],
					parent: 'codex',
					resolve: {
						filterService: ['BuildingFiltersService', (service: BuildingFiltersService) => {
							return service;
						}],
						entityPreviewState: [() => {
							return 'building';
						}],
					},
					views: {
						'content@listing': 'codex',
						'filters@listing': 'buildingFilter',
					},
				},
				{
					name: 'building',
					url: '/{item}',
					parent: 'buildings',
					ncyBreadcrumb: {
						parent: 'buildings',
					},
					onEnter: ['$stateParams', '$state$', 'ComponentOptionsService', ($stateParams: StateParams, $state$: IAppState, options: ComponentOptionsService) => {
						$state$.ncyBreadcrumb = $state$.ncyBreadcrumb || {};
						$state$.ncyBreadcrumb.label = data.getBuildingBySlug($stateParams.item)?.name;
						options.reset();
					}],
					onExit: ['ComponentOptionsService', (options: ComponentOptionsService) => {
						options.reset();
					}],
					resolve: {
						building: ['$transition$', ($transition$: ITransitionObject<{item: string}>) => {
							return data.getBuildingBySlug($transition$.params().item);
						}],
					},
					views: {
						'content@listing': {
							controller: 'BuildingController',
							controllerAs: 'ctrl',
							template: require('@templates/Controllers/building.html'),
						},
						'building_details@building': {
							componentProvider: ['building', (building: IBuildingSchema) => {
								if (data.isGeneratorBuilding(building)) {
									return 'generatorDetails';
								}
								if (data.isManufacturerBuilding(building)) {
									return 'manufacturerDetails';
								}
								if (data.isExtractorBuilding(building)) {
									return 'extractorDetails';
								}
								return 'otherBuildingDetails';
							}],
						},
						'building_related@building': {
							componentProvider: ['building', (building: IBuildingSchema) => {
								if (data.isGeneratorBuilding(building)) {
									return 'generatorFuels';
								}
								if (data.isManufacturerBuilding(building)) {
									return 'manufacturerRecipes';
								}
								if (data.isExtractorBuilding(building)) {
									return 'extractorResources';
								}
								return null;
							}],
						},
					},
				},
				{
					name: 'items',
					url: '/items',
					ncyBreadcrumb: {
						label: 'Item browser',
						parent: 'codex',
					},
					parent: 'codex',
					resolve: {
						filterService: ['ItemFiltersService', (service: ItemFiltersService) => {
							return service;
						}],
						entityPreviewState: [() => {
							return 'item';
						}],
					},
					onRetain: ['$transition$', 'filterService', ($transition: any, filterService: IFilterService<any>) => {
						if ('item' === $transition.from().name) {
							filterService.resetFilters();
						}
					}],
					views: {
						'content@listing': 'codex',
						'filters@listing': 'itemFilter',
					},
				},
				{
					name: 'item',
					url: '/{item}',
					parent: 'items',
					ncyBreadcrumb: {
						parent: 'items',
					},
					onEnter: ['$stateParams', '$state$', ($stateParams: StateParams, $state$: IAppState) => {
						$state$.ncyBreadcrumb = $state$.ncyBreadcrumb || {};
						$state$.ncyBreadcrumb.label = data.getItemBySlug($stateParams.item)?.name;
					}],
					views: {
						'content@listing': {
							controller: 'ItemController',
							controllerAs: 'ctrl',
							template: require('@templates/Controllers/item.html'),
						},
					},
				},
				{
					name: 'production',
					url: '/production',
					parent: 'listing',
					ncyBreadcrumb: {
						label: 'Production',
						parent: 'home',
					},
					views: {
						'content@listing': {
							controller: 'ProductionController',
							controllerAs: 'ctrl',
							template: require('@templates/Controllers/production.html'),
						},
					},
				},
			];
			appStates.forEach((state) => {
				$stateProvider.state(state);
			});
		}]);
		this.app.config([
			'$breadcrumbProvider',
			($breadcrumbProvider: angular.ncy.$breadcrumbProvider) => {
				$breadcrumbProvider.setOptions({
					template: require('@templates/Components/bootstrap4Breadcrumbs.html'),
					includeAbstract: true,
				});
			},
		]);
		this.app.run(['$transitions', '$rootScope', ($transitions: any, $rootScope: any) => {
			$rootScope.aprilMode = April.isApril();
			$rootScope.aprilModePossible = April.isAprilPossible();

			$transitions.onFinish({}, () => {
				const elements = document.getElementsByClassName('tooltip');
				for (const index in elements) {
					if (elements.hasOwnProperty(index)) {
						elements[index].remove();
					}
				}
			});
		}]);

		this.app.filter('number', () => {
			return AppModule.generateNumberFormattingFunction();
		});

		this.app.directive('app', () => {
			return new AppDirective;
		});

		this.app.directive('itemIcon', () => {
			return new ItemIconDirective;
		});

		this.app.directive('perfectScrollbar', () => {
			return new PerfectScrollbarDirective;
		});

		this.app.directive('lazyLoad', () => {
			return new LazyLoadDirective;
		});

		this.app.directive('tooltip', () => {
			return {
				restrict: 'A',
				link: (scope: IScope, element: any, attrs: any) => {
					element = $(element);
					element.data('boundary', 'window');
					element.on('mouseenter', () => {
						element.tooltip('_fixTitle')
							.tooltip('show');
					}).on('mouseleave', () => {
						element.tooltip('hide');
					}).on('click', () => {
						element.tooltip('hide');
					});
				},
			};
		});

		this.app.component('visualization', new VisualizationComponent);
		this.app.component('itemFilter', new ItemFilterComponent);
		this.app.component('buildingFilter', new BuildingFilterComponent);
		this.app.component('schematicFilter', new SchematicFilterComponent);
		this.app.component('applicationBreadcrumbs', new ApplicationBreadcrumbsComponent);
		this.app.component('entityListing', new EntityListingComponent);
		this.app.component('codex', new CodexComponent);
		this.app.component('recipesTable', new RecipesTableComponent);
		// details components
		this.app.component('manufacturerDetails', new ManufacturerDetailsComponent);
		this.app.component('extractorDetails', new ExtractorDetailsComponent);
		this.app.component('generatorDetails', new GeneratorDetailsComponent);
		this.app.component('otherBuildingDetails', new OtherBuildingsDetailsComponent);
		this.app.component('manufacturerRecipes', new ManufacturerRecipesComponent);
		this.app.component('extractorResources', new ExtractorResourcesComponent);
		this.app.component('generatorFuels', new GeneratorFuelsComponent);

		this.app.service('RecentlyVisitedItemsService', RecentlyVisitedItemsService);
		this.app.service('ItemFiltersService', ItemFiltersService);
		this.app.service('BuildingFiltersService', BuildingFiltersService);
		this.app.service('SchematicFiltersService', SchematicFiltersService);
		this.app.service('DataStorageService', DataStorageService);
		this.app.service('ComponentOptionsService', ComponentOptionsService);

		this.app.controller('HomeController', HomeController);
		this.app.controller('ItemController', ItemController);
		this.app.controller('BuildingController', BuildingController);
		this.app.controller('SchematicController', SchematicController);
		this.app.controller('ProductionController', ProductionController);
	}

	private static generateNumberFormattingFunction()
	{
		return (value: number) => {
			if (typeof value === 'undefined') {
				return 'NaN';
			} else if (value === ~~value) {
				return value;
			} else {
				return value.toFixed(5).replace(/\.?0+$/, '');
			}
		};
	}

}
