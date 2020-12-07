import {NavigationRoot} from '@modules/Navigation/Model/INavigationLink';

export const navigation: NavigationRoot[] = [
	{
		label: 'Home',
		icon:  'fas fa-fw fa-home',
		path:  '',
		exact: true,
		priority: 100,
		slot: 'left'
	}
];
