import {NavigationRoot} from '@modules/Navigation';

export const navigation: NavigationRoot[] = [
	{
		label:    'Codex',
		icon:     'fas fa-fw fa-th-large',
		path:     'codex',
		exact:    false,
		priority: 50,
		slot:     'left',
		children: [
			{
				path:  'items',
				exact: false,
				label: 'Items',
				icon:  'fas fa-fw fa-box-open'
			},
			{
				path:  'buildings',
				exact: false,
				label: 'Buildings',
				icon:  'fas fa-fw fa-industry'
			},
			{
				path:  'schematics',
				exact: false,
				label: 'Schematics',
				icon:  'fas fa-fw fa-flask'
			}
		]
	}
];
