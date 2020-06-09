import {IDirective, IScope} from 'angular';
import data from '@src/Data/Data';
import {IItemSchema} from '@src/Schema/IItemSchema';
import {IBuildingSchema} from '@src/Schema/IBuildingSchema';

export class ItemIconDirective implements IDirective
{

	public transclude = true;
	public restrict = 'E';
	public template = require('@templates/Directives/itemIcon.html');
	public scope = {
		item: '=',
		size: '=?',
		hideTooltip: '=?',
		dynamic: '=?',
	};

	public link(scope: IItemIconDirectiveScope)
	{
		if (!scope.hideTooltip) {
			scope.hideTooltip = false; // to make sure, that's always false if not set
		}
		const update = () => {
			if (typeof scope.item === 'object') {
				scope.itemEntity = scope.item;
			} else {
				scope.itemEntity = data.getItemByClassName(scope.item);
				if (!scope.itemEntity) {
					scope.itemEntity = data.getBuildingByClassName(scope.item);
				}
			}
			if (!scope.size) {
				scope.size = 32;
			}

			scope.imageSize = scope.size > 64 ? 256 : 64;
		};

		if (scope.dynamic) {
			scope.$on('$destroy', scope.$watch('item', update));
		} else {
			update();
		}
	}

}

interface IItemIconDirectiveScope extends IScope
{

	item: IItemSchema|IBuildingSchema|string;
	itemEntity: IItemSchema|IBuildingSchema|null;
	size: number;
	imageSize: number;
	dynamic: any;
	hideTooltip: boolean|null;
}
