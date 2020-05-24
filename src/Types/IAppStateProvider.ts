import {Ng1StateDeclaration, StateProvider} from 'angular-ui-router';

interface IAppBreadcrumbState
{
	ncyBreadcrumb?: {
		label?: string;
		parent?: string;
		skip?: boolean;
	};
	ncyBreadcrumbLabel?: string;
	ncyBreadcrumbLink?: string;
}

export interface IAppState extends Ng1StateDeclaration, IAppBreadcrumbState
{

}

export interface IAppStateProvider extends StateProvider
{
	state(definition: IAppState): StateProvider;

	state(name: string, definition: IAppState): StateProvider;
}
