import {NavigationRoot} from '@modules/Navigation';

export const navigation: NavigationRoot[] = [
	{
		icon:     'fas fa-users',
		label:    'Community',
		slot:     'right',
		priority: 100,
		children: [
			{
				header: 'Contribute'
			},
			{
				url:   'https://discord.gg/pcGyj8p',
				label: 'Discord server',
				icon:  'fab fa-fw fa-discord'
			},
			{
				url:   'https://github.com/greeny/SatisfactoryTools',
				label: 'Github repository',
				icon:  'fab fa-fw fa-github'
			},
			{
				divider: true
			},
			{
				header: 'Support me'
			},
			{
				url:   'https://www.paypal.me/greenydev',
				label: 'Donate through Paypal',
				icon:  'fab fa-fw fa-paypal'
			},
			{
				url:   'https://patreon.com/greeny_dev',
				label: 'Pledge on Patreon',
				icon:  'fab fa-fw fa-patreon'
			}
		]
	}
];
