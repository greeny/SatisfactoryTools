import {Injectable} from "@angular/core";
import {LocalStorageService} from "ngx-localstorage";
import {IProductionTab} from "@modules/Calculator/Model/IProductionTab";
import {IProductionToolRequest} from "@tools/Production/IProductionToolRequest";
import {ProductionTabFactory} from "@modules/Calculator/Service/ProductionTabFactory";

@Injectable()
export class ProductionPersistentStorage {
	constructor(private storage: LocalStorageService) {
	}

	public update(tabs: IProductionTab[]): void {
		this.storage.set('production', tabs.map(t => t.productionToolRequest));
	}

	public load(): IProductionTab[] {
		const requests = (this.storage.get('production') || []) as IProductionToolRequest[];

		return requests.map(request => ProductionTabFactory.create(request));
	}
}
