import {Injectable} from '@angular/core';
import {AbstractBreadcrumbResolver} from '@modules/Codex/Resolver/AbstractBreadcrumbResolver';
import {BuildingsDataProvider} from '@modules/Codex/Service/DataProvider';
import {IBuildingSchema} from '@src/Schema/IBuildingSchema';

@Injectable()
export class BuildingBreadcrumbsResolver extends AbstractBreadcrumbResolver<IBuildingSchema>
{
	constructor(protected provider: BuildingsDataProvider)
	{
		super(provider);
	}
}
