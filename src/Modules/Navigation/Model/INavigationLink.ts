export interface IBaseNavigationLink
{
	label: string;
	icon?: string;
	children?: NavigationChildren[];
}

export type LeftSlot = 'left';
export type RightSlot = 'right';
type DefaultNavigationType = INavigationInternalLink | INavigationExternalLink | INavigationContainer;
export type NavigationRoot = DefaultNavigationType & { priority: number, slot: LeftSlot | RightSlot }
export type NavigationChildren = DefaultNavigationType | INavigationDivider | INavigationHeader;

export interface INavigationContainer extends IBaseNavigationLink
{
}

export interface INavigationInternalLink extends IBaseNavigationLink
{
	path: string;
	exact: boolean;
}

export interface INavigationExternalLink extends IBaseNavigationLink
{
	url: string;
}

export interface INavigationDivider
{
	divider: boolean;
}

export interface INavigationHeader
{
	header: string;
}
