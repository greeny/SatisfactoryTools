import {Component, Inject, InjectionToken, OnInit, Optional} from '@angular/core';
import {Router} from '@angular/router';
import {INavigationDivider, INavigationHeader, NavigationChildren, NavigationRoot} from '@modules/Navigation';
import {
	IBaseNavigationLink,
	INavigationContainer,
	INavigationExternalLink,
	INavigationInternalLink
} from '@modules/Navigation/Model/INavigationLink';

export const NAVIGATION_CONFIG = new InjectionToken<NavigationChildren[]>('NAVIGATION_CONFIG');

@Component({
	selector:    'sf-navigation',
	templateUrl: './NavigationComponent.html'
})
export class NavigationComponent implements OnInit
{
	public leftNavigation: NavigationRoot[] = [];
	public rightNavigation: NavigationRoot[] = [];

	constructor(@Inject(NAVIGATION_CONFIG) @Optional() private readonly navigation: NavigationChildren[] = [], private router: Router)
	{
	}

	private static filterRoot(entry: NavigationChildren): entry is NavigationRoot
	{
		return (entry as NavigationRoot).priority !== undefined && (entry as NavigationRoot).slot !== undefined;
	}

	ngOnInit(): void
	{
		const rootNavigation = this.navigation.filter(NavigationComponent.filterRoot);
		this.leftNavigation = rootNavigation
			.filter(e => e.slot === 'left')
			.sort(this.navigationSortFn);
		this.rightNavigation = rootNavigation
			.filter(e => e.slot === 'right')
			.sort(this.navigationSortFn);
	}

	public isDivider(entry: NavigationChildren): entry is INavigationDivider
	{
		return (entry as INavigationDivider).divider !== undefined;
	}

	public isHeader(entry: NavigationChildren): entry is INavigationHeader
	{
		return (entry as INavigationHeader).header !== undefined;
	}

	public isLink(entry: NavigationChildren): entry is NavigationChildren
	{
		return ((entry as INavigationInternalLink).path !== undefined || (entry as INavigationExternalLink).url !== undefined) && (entry as IBaseNavigationLink).label !== undefined;
	}

	public isLinkContainer(entry: NavigationChildren): entry is INavigationContainer
	{
		return (entry as INavigationContainer).children !== undefined && (entry as INavigationContainer).children.length > 0;
	}

	combinePath(path: string, upper: string[] = []): string[]
	{
		return [...upper, path];
	}

	isActive(url: string[], exact: boolean): boolean
	{
		return this.router.isActive(url.join('/'), exact);
	}

	private navigationSortFn = (a: NavigationRoot, b: NavigationRoot) => a.priority > b.priority ? -1 : 1;
}
