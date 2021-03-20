import {NavigationRoot} from "@modules/Navigation";

export const navigation: NavigationRoot[] = [
	{
		label:    'Calculator',
		icon:     'fas fa-fw fa-chart-line',
		path:     'calculator',
		exact:    true,
		priority: 50,
		slot:     'left'
	}
];
