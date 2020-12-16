import {Injectable} from '@angular/core';
import {AbstractBreadcrumbResolver} from '@modules/Codex/Resolver/AbstractBreadcrumbResolver';
import {ItemsDataProvider} from '@modules/Codex/Service/DataProvider';
import {IItemSchema} from '@src/Schema/IItemSchema';

@Injectable()
export class ItemBreadcrumbsResolver extends AbstractBreadcrumbResolver<IItemSchema>
{
	constructor(protected provider: ItemsDataProvider)
	{
		super(provider);
	}
}
