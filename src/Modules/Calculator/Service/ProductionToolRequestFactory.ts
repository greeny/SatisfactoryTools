import {IProductionToolRequest} from "@tools/Production/IProductionToolRequest";

export class ProductionToolRequestFactory {
    public static create(): IProductionToolRequest {
        return {
            version: 1,
            name: null,
            icon: null,
            allowedAlternateRecipes: [],
            blockedRecipes: [],
            blockedResources: [],
            sinkableResources: [],
            production: [],
            input: [],
            resourceMax: {},
            resourceWeight: {},
        };
    }
}
