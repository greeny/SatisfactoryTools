import {ILocationProvider, IModule, ISCEProvider} from 'angular';
import {StateProvider, UrlRouterProvider} from 'angular-ui-router';
import {HomeController} from '@src/Module/Controllers/HomeController';
import {AppDirective} from '@src/Module/Directives/AppDirective';
import {ItemController} from '@src/Module/Controllers/ItemController';
import {ItemIconDirective} from '@src/Module/Directives/ItemIconDirective';
import {RecentlyVisitedItemsService} from '@src/Module/Services/RecentlyVisitedItemsService';
import {ProductionController} from '@src/Module/Controllers/ProductionController';
import {VisualizationComponent} from '@src/Module/Components/VisualizationComponent';
import {ItemFilterComponent} from '@src/Module/Components/ItemFilterComponent';
import {ItemFiltersService} from '@src/Module/Services/ItemFiltersService';

export class AppModule
{


	public constructor(private readonly app: IModule)
	{
	}

	public register(): void
	{
		this.app.config([
			'$locationProvider', '$stateProvider', '$urlRouterProvider', '$sceProvider',
			($locationProvider: ILocationProvider, $stateProvider: StateProvider, $urlRouterProvider: UrlRouterProvider, $sceProvider: ISCEProvider) => {
			$locationProvider.html5Mode({
				enabled: true,
				requireBase: false,
			}).hashPrefix('!');

			$sceProvider.enabled(false);

			$stateProvider.state('home', {
				url: '/',
				controller: 'HomeController',
				controllerAs: 'ctrl',
				template: require('@templates/Controllers/home.html'),
			});

			$stateProvider.state('item', {
				url: '/items/{item}',
				controller: 'ItemController',
				controllerAs: 'ctrl',
				template: require('@templates/Controllers/item.html'),
			});

			$stateProvider.state('production', {
				controller: 'ProductionController',
				controllerAs: 'ctrl',
				url: '/production',
				template: require('@templates/Controllers/production.html'),
			});
		}]);

		this.app.run(['$transitions', '$rootScope', ($transitions: any, $rootScope: any) => {
			$rootScope.aprilMode = false;

			const now = new Date();
			if (now.getDate() === 1 && now.getMonth() === 3) {
				$rootScope.aprilMode = true;
				document.body.className += ' april-mode';
				window.scrollTo(0, document.body.scrollHeight);
			}

			$rootScope.disableApril = () => {
				$rootScope.aprilMode = false;
			};

			$transitions.onFinish({}, () => {
				const elements = document.getElementsByClassName('tooltip'); // TODO fix jQLite and replace with angular.element
				for (const index in elements) {
					if (elements.hasOwnProperty(index)) {
						elements[index].remove();
					}
				}
				if ($rootScope.aprilMode) {
					setTimeout(() => {
						window.scrollTo(0, document.body.scrollHeight);
					}, 0);
				} else {
					document.documentElement.scrollTop = 0;
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

		this.app.component('visualization', new VisualizationComponent);
		this.app.component('itemFilter', new ItemFilterComponent);

		this.app.service('RecentlyVisitedItemsService', RecentlyVisitedItemsService);
		this.app.service('ItemFiltersService', ItemFiltersService);

		this.app.controller('HomeController', HomeController);
		this.app.controller('ItemController', ItemController);
		this.app.controller('ProductionController', ProductionController);
	}

	private static generateNumberFormattingFunction()
	{
		return (value: number) => {
			if (value === ~~value) {
				return value;
			} else {
				return value.toFixed(5).replace(/\.?0+$/, '');
			}
		};
	}

}
