import { McpServer } from '@modelcontextprotocol/sdk/server/mcp.js';
import { StdioServerTransport } from '@modelcontextprotocol/sdk/server/stdio.js';
import { z } from 'zod';
import * as path from 'path';
import * as fs from 'fs';
import * as zlib from 'zlib';

// ─── Interfaces (mirroring /src/Schema/) ─────────────────────────────────────

interface IColorSchema { r: number; g: number; b: number; a: number; }
interface ISizeSchema { width: number; length: number; height: number; }

interface IItemSchema {
  slug: string;
  icon?: string;
  name: string;
  description: string;
  className: string;
  stackSize: number;
  sinkPoints: number;
  energyValue: number;
  radioactiveDecay: number;
  liquid: boolean;
  fluidColor: IColorSchema;
}

interface IItemAmountSchema {
  item: string;
  amount: number;
}

interface IRecipeSchema {
  slug: string;
  name: string;
  className: string;
  alternate: boolean;
  time: number;
  inHand: boolean;
  forBuilding: boolean;
  inWorkshop: boolean;
  inMachine: boolean;
  manualTimeMultiplier: number;
  ingredients: IItemAmountSchema[];
  products: IItemAmountSchema[];
  producedIn: string[];
  isVariablePower: boolean;
  minPower: number;
  maxPower: number;
}

interface IBuildingMetadataSchema {
  powerConsumption?: number;
  powerConsumptionExponent?: number;
  manufacturingSpeed?: number;
  beltSpeed?: number;
  storageSize?: number;
  inventorySize?: number;
  flowLimit?: number;
  storageCapacity?: number;
  isVariablePower?: boolean;
  minPowerConsumption?: number;
  maxPowerConsumption?: number;
}

interface IBuildingSchema {
  slug: string;
  icon?: string;
  name: string;
  description: string;
  className: string;
  categories: string[];
  buildMenuPriority: number;
  metadata: IBuildingMetadataSchema;
  size: ISizeSchema;
}

interface ISchematicUnlockSchema {
  recipes: string[];
  scannerResources: string[];
  inventorySlots: number;
  giveItems: IItemAmountSchema[];
}

interface ISchematicSchema {
  className: string;
  type: string;
  name: string;
  slug: string;
  icon?: string;
  tier: number;
  time: number;
  mam: boolean;
  alternate: boolean;
  cost: IItemAmountSchema[];
  unlock: ISchematicUnlockSchema;
  requiredSchematics: string[];
}

interface IResourceSchema {
  item: string;
  speed: number;
  pingColor?: IColorSchema;
}

interface IGeneratorSchema {
  className: string;
  fuel: string[];
  powerProduction: number;
  powerProductionExponent: number;
  waterToPowerRatio: number;
}

interface IMinerSchema {
  className: string;
  allowedResources: string[];
  allowLiquids: boolean;
  allowSolids: boolean;
  itemsPerCycle: number;
  extractCycleTime: number;
}

interface IJsonSchema {
  items: Record<string, IItemSchema>;
  recipes: Record<string, IRecipeSchema>;
  schematics: Record<string, ISchematicSchema>;
  generators: Record<string, IGeneratorSchema>;
  resources: Record<string, IResourceSchema>;
  miners: Record<string, IMinerSchema>;
  buildings: Record<string, IBuildingSchema>;
}

// ─── Production Data Interfaces (mirroring /src/Tools/Production/IProductionData.ts) ──

interface IProductionDataRequestItem {
  item: string | null;
  type: string;      // 'perMinute' | 'max'
  amount: number;
  ratio: number;
}

interface IProductionDataRequestInput {
  item: string | null;
  amount: number;
}

interface IProductionDataRequest {
  resourceMax: Record<string, number>;
  resourceWeight: Record<string, number>;
  blockedResources: string[];
  blockedRecipes: string[];
  blockedMachines?: string[];
  allowedAlternateRecipes: string[];
  sinkableResources: string[];
  production: IProductionDataRequestItem[];
  input: IProductionDataRequestInput[];
}

interface IProductionData {
  metadata: {
    name: string | null;
    icon: string | null;
    schemaVersion: number;
    gameVersion: string;
  };
  request: IProductionDataRequest;
}

interface ISftFileContents {
  type: 'tabs';
  tabs: IProductionData[];
}

// ─── Data Loading ─────────────────────────────────────────────────────────────

type GameVersion = '1.0' | '0.8' | '1.0-ficsmas';

// Static paths allow esbuild to inline the JSON at build time,
// making dist/index.js a self-contained file with no external dependencies.
// eslint-disable-next-line @typescript-eslint/no-require-imports
const gameData: Record<GameVersion, IJsonSchema> = {
  '1.0':         require('../../data/data1.0.json') as IJsonSchema,
  '0.8':         require('../../data/data.json') as IJsonSchema,
  '1.0-ficsmas': require('../../data/data1.0-ficsmas.json') as IJsonSchema,
};

// ─── Resource Constants (from /src/Data/Data.ts) ──────────────────────────────

const RESOURCE_AMOUNTS: Record<GameVersion, Record<string, number>> = {
  '0.8': {
    Desc_OreIron_C:    70380,
    Desc_OreCopper_C:  28860,
    Desc_Stone_C:      52860,
    Desc_Coal_C:       30120,
    Desc_OreGold_C:    11040,
    Desc_LiquidOil_C:  11700,
    Desc_RawQuartz_C:  10500,
    Desc_Sulfur_C:      6840,
    Desc_OreBauxite_C:  9780,
    Desc_OreUranium_C:  2100,
    Desc_NitrogenGas_C: 12000,
    Desc_SAM_C:            0,
    Desc_Water_C:      Number.MAX_SAFE_INTEGER,
  },
  '1.0': {
    Desc_OreIron_C:    92100,
    Desc_OreCopper_C:  36900,
    Desc_Stone_C:      69900,
    Desc_Coal_C:       42300,
    Desc_OreGold_C:    15000,
    Desc_LiquidOil_C:  12600,
    Desc_RawQuartz_C:  13500,
    Desc_Sulfur_C:     10800,
    Desc_OreBauxite_C: 12300,
    Desc_OreUranium_C:  2100,
    Desc_NitrogenGas_C: 12000,
    Desc_SAM_C:        10200,
    Desc_Water_C:      Number.MAX_SAFE_INTEGER,
  },
  '1.0-ficsmas': {
    Desc_OreIron_C:    92100,
    Desc_OreCopper_C:  36900,
    Desc_Stone_C:      69900,
    Desc_Coal_C:       42300,
    Desc_OreGold_C:    15000,
    Desc_LiquidOil_C:  12600,
    Desc_RawQuartz_C:  13500,
    Desc_Sulfur_C:     10800,
    Desc_OreBauxite_C: 12300,
    Desc_OreUranium_C:  2100,
    Desc_NitrogenGas_C: 12000,
    Desc_SAM_C:        10200,
    Desc_Water_C:      Number.MAX_SAFE_INTEGER,
  },
};

const RESOURCE_WEIGHTS: Record<GameVersion, Record<string, number>> = {
  '0.8': {
    Desc_OreIron_C:    1,
    Desc_OreCopper_C:  2.438669438669439,
    Desc_Stone_C:      1.3314415437003406,
    Desc_Coal_C:       2.277669902912621,
    Desc_OreGold_C:    6.375,
    Desc_LiquidOil_C:  6.015384615384615,
    Desc_RawQuartz_C:  6.702857142857143,
    Desc_Sulfur_C:     10.289473684210526,
    Desc_OreBauxite_C: 7.196319018404908,
    Desc_OreUranium_C: 33.51428571428572,
    Desc_NitrogenGas_C: 5.865,
    Desc_SAM_C:        10000,
    Desc_Water_C:      0,
  },
  '1.0': {
    Desc_OreIron_C:    1,
    Desc_OreCopper_C:  2.4959349593495936,
    Desc_Stone_C:      1.3175965665236051,
    Desc_Coal_C:       2.1773049645390072,
    Desc_OreGold_C:    6.140000000000001,
    Desc_LiquidOil_C:  7.30952380952381,
    Desc_RawQuartz_C:  6.822222222222222,
    Desc_Sulfur_C:     8.527777777777779,
    Desc_OreBauxite_C: 7.487804878048781,
    Desc_OreUranium_C: 43.85714285714286,
    Desc_NitrogenGas_C: 7.675000000000001,
    Desc_SAM_C:        9.029411764705882,
    Desc_Water_C:      0,
  },
  '1.0-ficsmas': {
    Desc_OreIron_C:    1,
    Desc_OreCopper_C:  2.4959349593495936,
    Desc_Stone_C:      1.3175965665236051,
    Desc_Coal_C:       2.1773049645390072,
    Desc_OreGold_C:    6.140000000000001,
    Desc_LiquidOil_C:  7.30952380952381,
    Desc_RawQuartz_C:  6.822222222222222,
    Desc_Sulfur_C:     8.527777777777779,
    Desc_OreBauxite_C: 7.487804878048781,
    Desc_OreUranium_C: 43.85714285714286,
    Desc_NitrogenGas_C: 7.675000000000001,
    Desc_SAM_C:        9.029411764705882,
    Desc_Water_C:      0,
  },
};

// ─── Helper Utilities ─────────────────────────────────────────────────────────

function resolveItem(data: IJsonSchema, identifier: string): IItemSchema | null {
  if (identifier in data.items) return data.items[identifier];
  for (const item of Object.values(data.items)) {
    if (item.slug === identifier) return item;
  }
  return null;
}

function resolveRecipe(data: IJsonSchema, identifier: string): IRecipeSchema | null {
  if (identifier in data.recipes) return data.recipes[identifier];
  for (const recipe of Object.values(data.recipes)) {
    if (recipe.slug === identifier) return recipe;
  }
  return null;
}

function resolveBuilding(data: IJsonSchema, identifier: string): IBuildingSchema | null {
  if (identifier in data.buildings) return data.buildings[identifier];
  for (const building of Object.values(data.buildings)) {
    if (building.slug === identifier) return building;
  }
  return null;
}

function resolveSchematic(data: IJsonSchema, identifier: string): ISchematicSchema | null {
  if (identifier in data.schematics) return data.schematics[identifier];
  for (const schematic of Object.values(data.schematics)) {
    if (schematic.slug === identifier) return schematic;
  }
  return null;
}

function perMinute(amount: number, craftTime: number): number {
  return Math.round(((amount / craftTime) * 60) * 10000) / 10000;
}

function formatRecipe(recipe: IRecipeSchema, data: IJsonSchema): object {
  return {
    className:   recipe.className,
    slug:        recipe.slug,
    name:        recipe.name,
    alternate:   recipe.alternate,
    craftTime:   recipe.time,
    inMachine:   recipe.inMachine,
    forBuilding: recipe.forBuilding,
    ingredients: recipe.ingredients.map(ing => ({
      item:      ing.item,
      itemName:  data.items[ing.item]?.name ?? ing.item,
      amount:    ing.amount,
      perMinute: perMinute(ing.amount, recipe.time),
    })),
    products: recipe.products.map(prod => ({
      item:      prod.item,
      itemName:  data.items[prod.item]?.name ?? prod.item,
      amount:    prod.amount,
      perMinute: perMinute(prod.amount, recipe.time),
    })),
    producedIn: recipe.producedIn.map(bClass => ({
      className: bClass,
      name:      data.buildings[bClass]?.name ?? bClass,
    })),
  };
}

function notFound(type: string, identifier: string) {
  return {
    content: [{ type: 'text' as const, text: `${type} not found: "${identifier}"` }],
    isError: true,
  };
}

// ─── MCP Server ───────────────────────────────────────────────────────────────

const server = new McpServer({
  name: 'satisfactory-tools',
  version: '1.0.0',
});

const versionParam = z.enum(['1.0', '0.8', '1.0-ficsmas'])
  .default('1.0')
  .describe('Game version. Defaults to 1.0 (current release).');

// ── search_items ──────────────────────────────────────────────────────────────

server.tool(
  'search_items',
  'Search and list Satisfactory items. Returns className, slug, name, liquid flag, stackSize, sinkPoints. Use get_item for full details.',
  {
    query:    z.string().optional().describe('Case-insensitive text search on name or description'),
    liquid:   z.boolean().optional().describe('true = liquids only, false = solids only'),
    sinkable: z.boolean().optional().describe('true = only items with sinkPoints > 0'),
    version:  versionParam,
  },
  async ({ query, liquid, sinkable, version }) => {
    const data = gameData[version as GameVersion];
    let items = Object.values(data.items);
    if (query) {
      const q = query.toLowerCase();
      items = items.filter(i => i.name.toLowerCase().includes(q) || i.description.toLowerCase().includes(q));
    }
    if (liquid !== undefined) items = items.filter(i => i.liquid === liquid);
    if (sinkable) items = items.filter(i => i.sinkPoints > 0);
    items.sort((a, b) => a.name.localeCompare(b.name));
    return {
      content: [{
        type: 'text',
        text: JSON.stringify(items.map(i => ({
          className:  i.className,
          slug:       i.slug,
          name:       i.name,
          liquid:     i.liquid,
          stackSize:  i.stackSize,
          sinkPoints: i.sinkPoints,
        })), null, 2),
      }],
    };
  },
);

// ── get_item ──────────────────────────────────────────────────────────────────

server.tool(
  'get_item',
  'Get full details for a single Satisfactory item by className (e.g. Desc_IronPlate_C) or slug (e.g. iron-plate). Includes whether it is a raw resource.',
  {
    identifier: z.string().describe('Item className or slug'),
    version:    versionParam,
  },
  async ({ identifier, version }) => {
    const data = gameData[version as GameVersion];
    const item = resolveItem(data, identifier);
    if (!item) return notFound('Item', identifier);
    const isRawResource = Object.values(data.resources).some(r => r.item === item.className);
    return {
      content: [{
        type: 'text',
        text: JSON.stringify({ ...item, isRawResource }, null, 2),
      }],
    };
  },
);

// ── get_item_recipes ──────────────────────────────────────────────────────────

server.tool(
  'get_item_recipes',
  'Get all recipes that produce the given item. Base recipes first, then alternates. Includes per-minute rates.',
  {
    identifier:        z.string().describe('Item className or slug'),
    includeAlternates: z.boolean().default(true).describe('Include alternate recipes'),
    version:           versionParam,
  },
  async ({ identifier, includeAlternates, version }) => {
    const data = gameData[version as GameVersion];
    const item = resolveItem(data, identifier);
    if (!item) return notFound('Item', identifier);
    const recipes = Object.values(data.recipes)
      .filter(r => r.products.some(p => p.item === item.className) && (includeAlternates || !r.alternate))
      .sort((a, b) => Number(a.alternate) - Number(b.alternate));
    return {
      content: [{
        type: 'text',
        text: JSON.stringify(recipes.map(r => formatRecipe(r, data)), null, 2),
      }],
    };
  },
);

// ── get_item_usages ───────────────────────────────────────────────────────────

server.tool(
  'get_item_usages',
  'Get all machine recipes that use the given item as an ingredient. Building-construction recipes excluded by default.',
  {
    identifier:         z.string().describe('Item className or slug'),
    includeForBuilding: z.boolean().default(false).describe('Include building-construction recipes'),
    version:            versionParam,
  },
  async ({ identifier, includeForBuilding, version }) => {
    const data = gameData[version as GameVersion];
    const item = resolveItem(data, identifier);
    if (!item) return notFound('Item', identifier);
    const recipes = Object.values(data.recipes)
      .filter(r => r.ingredients.some(i => i.item === item.className) && (includeForBuilding || !r.forBuilding))
      .sort((a, b) => Number(a.alternate) - Number(b.alternate));
    return {
      content: [{
        type: 'text',
        text: JSON.stringify(recipes.map(r => formatRecipe(r, data)), null, 2),
      }],
    };
  },
);

// ── search_recipes ────────────────────────────────────────────────────────────

server.tool(
  'search_recipes',
  'Search and filter recipes. Useful filters: alternate (true/false), inMachine, producedIn (building className).',
  {
    query:      z.string().optional().describe('Case-insensitive search on recipe name'),
    alternate:  z.boolean().optional().describe('true = alternates only, false = base recipes only'),
    inMachine:  z.boolean().optional().describe('Filter to machine-producible recipes'),
    producedIn: z.string().optional().describe('Building className to filter by (e.g. Build_ConstructorMk1_C)'),
    version:    versionParam,
  },
  async ({ query, alternate, inMachine, producedIn, version }) => {
    const data = gameData[version as GameVersion];
    let recipes = Object.values(data.recipes);
    if (query) {
      const q = query.toLowerCase();
      recipes = recipes.filter(r => r.name.toLowerCase().includes(q));
    }
    if (alternate !== undefined) recipes = recipes.filter(r => r.alternate === alternate);
    if (inMachine !== undefined) recipes = recipes.filter(r => r.inMachine === inMachine);
    if (producedIn) recipes = recipes.filter(r => r.producedIn.includes(producedIn));
    recipes.sort((a, b) => a.name.localeCompare(b.name));
    return {
      content: [{
        type: 'text',
        text: JSON.stringify(recipes.map(r => formatRecipe(r, data)), null, 2),
      }],
    };
  },
);

// ── get_recipe ────────────────────────────────────────────────────────────────

server.tool(
  'get_recipe',
  'Get full details for a recipe by className or slug. Includes per-minute rates for ingredients and products.',
  {
    identifier: z.string().describe('Recipe className or slug'),
    version:    versionParam,
  },
  async ({ identifier, version }) => {
    const data = gameData[version as GameVersion];
    const recipe = resolveRecipe(data, identifier);
    if (!recipe) return notFound('Recipe', identifier);
    return {
      content: [{ type: 'text', text: JSON.stringify(formatRecipe(recipe, data), null, 2) }],
    };
  },
);

// ── search_buildings ──────────────────────────────────────────────────────────

server.tool(
  'search_buildings',
  'Search and list buildings/machines. Use manufacturerOnly to filter to production machines.',
  {
    query:            z.string().optional().describe('Case-insensitive search on name or description'),
    manufacturerOnly: z.boolean().optional().describe('Only return manufacturer buildings (those with manufacturingSpeed)'),
    version:          versionParam,
  },
  async ({ query, manufacturerOnly, version }) => {
    const data = gameData[version as GameVersion];
    let buildings = Object.values(data.buildings);
    if (query) {
      const q = query.toLowerCase();
      buildings = buildings.filter(b => b.name.toLowerCase().includes(q) || b.description.toLowerCase().includes(q));
    }
    if (manufacturerOnly) {
      buildings = buildings.filter(b =>
        b.metadata.manufacturingSpeed !== undefined && b.metadata.manufacturingSpeed > 0,
      );
    }
    buildings.sort((a, b) => a.name.localeCompare(b.name));
    return {
      content: [{
        type: 'text',
        text: JSON.stringify(buildings.map(b => ({
          className:         b.className,
          slug:              b.slug,
          name:              b.name,
          categories:        b.categories,
          powerConsumption:  b.metadata.powerConsumption,
          manufacturingSpeed: b.metadata.manufacturingSpeed,
          isGenerator:       b.className in data.generators,
          isMiner:           b.className in data.miners,
        })), null, 2),
      }],
    };
  },
);

// ── get_building ──────────────────────────────────────────────────────────────

server.tool(
  'get_building',
  'Get full details for a building by className or slug. Includes runnable recipes, generator details, and miner details.',
  {
    identifier: z.string().describe('Building className or slug'),
    version:    versionParam,
  },
  async ({ identifier, version }) => {
    const data = gameData[version as GameVersion];
    const building = resolveBuilding(data, identifier);
    if (!building) return notFound('Building', identifier);
    const isGenerator = building.className in data.generators;
    const isMiner     = building.className in data.miners;
    const recipes = Object.values(data.recipes)
      .filter(r => r.producedIn.includes(building.className))
      .map(r => ({ className: r.className, name: r.name, alternate: r.alternate }));
    return {
      content: [{
        type: 'text',
        text: JSON.stringify({
          ...building,
          isGenerator,
          isMiner,
          generatorDetails: isGenerator ? data.generators[building.className] : null,
          minerDetails:     isMiner     ? data.miners[building.className]     : null,
          recipes,
        }, null, 2),
      }],
    };
  },
);

// ── search_schematics ─────────────────────────────────────────────────────────

server.tool(
  'search_schematics',
  'Search schematics (milestones, MAM research, hard drives, etc.). Filter by type, tier, or MAM flag.',
  {
    query:   z.string().optional().describe('Case-insensitive search on name'),
    type:    z.string().optional().describe('Schematic type: EST_Milestone, EST_MAM, EST_HardDrive, EST_Alternate, EST_Tutorial, EST_ResourceSink, EST_Customization'),
    tier:    z.number().int().min(0).max(9).optional().describe('Filter by tier number (0-9)'),
    mam:     z.boolean().optional().describe('true = MAM research only'),
    version: versionParam,
  },
  async ({ query, type, tier, mam, version }) => {
    const data = gameData[version as GameVersion];
    let schematics = Object.values(data.schematics);
    if (query) {
      const q = query.toLowerCase();
      schematics = schematics.filter(s => s.name.toLowerCase().includes(q));
    }
    if (type !== undefined) schematics = schematics.filter(s => s.type === type);
    if (tier !== undefined) schematics = schematics.filter(s => s.tier === tier);
    if (mam  !== undefined) schematics = schematics.filter(s => s.mam  === mam);
    schematics.sort((a, b) => a.tier - b.tier || a.name.localeCompare(b.name));
    return {
      content: [{
        type: 'text',
        text: JSON.stringify(schematics.map(s => ({
          className: s.className,
          slug:      s.slug,
          name:      s.name,
          type:      s.type,
          tier:      s.tier,
          mam:       s.mam,
          alternate: s.alternate,
        })), null, 2),
      }],
    };
  },
);

// ── get_schematic ─────────────────────────────────────────────────────────────

server.tool(
  'get_schematic',
  'Get full details for a schematic by className or slug. Includes cost items and unlocked recipes with human-readable names.',
  {
    identifier: z.string().describe('Schematic className or slug'),
    version:    versionParam,
  },
  async ({ identifier, version }) => {
    const data = gameData[version as GameVersion];
    const schematic = resolveSchematic(data, identifier);
    if (!schematic) return notFound('Schematic', identifier);
    return {
      content: [{
        type: 'text',
        text: JSON.stringify({
          ...schematic,
          cost: schematic.cost.map(c => ({
            ...c,
            itemName: data.items[c.item]?.name ?? c.item,
          })),
          unlock: {
            ...schematic.unlock,
            recipes: schematic.unlock.recipes.map(rClass => ({
              className: rClass,
              name:      data.recipes[rClass]?.name ?? rClass,
            })),
          },
          requiredSchematics: schematic.requiredSchematics.map(sClass => ({
            className: sClass,
            name:      data.schematics[sClass]?.name ?? sClass,
          })),
        }, null, 2),
      }],
    };
  },
);

// ── get_raw_resources ─────────────────────────────────────────────────────────

server.tool(
  'get_raw_resources',
  'List all raw resources with their item details and default maximum per-minute amounts (total world output at 100% efficiency). Use these classNames in calculate_production resourceMaxOverrides.',
  { version: versionParam },
  async ({ version }) => {
    const v = version as GameVersion;
    const data    = gameData[v];
    const amounts = RESOURCE_AMOUNTS[v];
    const result = Object.values(data.resources).map(r => {
      const item = data.items[r.item];
      return {
        className:        r.item,
        name:             item?.name ?? r.item,
        slug:             item?.slug ?? '',
        liquid:           item?.liquid ?? false,
        defaultMaxPerMin: amounts[r.item] ?? 0,
      };
    }).sort((a, b) => a.name.localeCompare(b.name));
    return {
      content: [{ type: 'text', text: JSON.stringify(result, null, 2) }],
    };
  },
);

// ── calculate_production ──────────────────────────────────────────────────────

server.tool(
  'calculate_production',
  `Calculate an optimal production chain using the SatisfactoryTools solver API.
Returns machine counts per recipe needed to hit your production targets.
Tips:
- Use search_items to find item classNames (e.g. Desc_IronPlate_C)
- Use search_recipes with alternate:true to find alternate recipe classNames to allow
- Use get_raw_resources to see default resource limits and valid resource classNames`,
  {
    gameVersion: z.enum(['0.8.0', '1.0.0', '1.0.0-ficsmas'])
      .default('1.0.0')
      .describe('Game version for the solver'),
    production: z.array(z.object({
      item:   z.string().describe('Item className to produce (e.g. Desc_IronPlate_C)'),
      type:   z.enum(['perMinute', 'max']).default('perMinute'),
      amount: z.number().default(0).describe('Amount per minute when type=perMinute'),
      ratio:  z.number().default(1).describe('Ratio when type=max'),
    })).min(1).describe('What to produce'),
    allowedAlternateRecipes: z.array(z.string())
      .default([])
      .describe('Recipe classNames of alternate recipes to allow'),
    blockedRecipes:   z.array(z.string()).default([]),
    blockedResources: z.array(z.string()).default([]),
    blockedMachines:  z.array(z.string()).default([]),
    sinkableResources: z.array(z.string())
      .default([])
      .describe('Item classNames that can be fed into the AWESOME Sink'),
    input: z.array(z.object({
      item:   z.string().describe('Item className'),
      amount: z.number().describe('Items per minute available as input'),
    })).default([]).describe('Pre-available items (e.g. imported from another factory)'),
    resourceMaxOverrides: z.record(z.string(), z.number())
      .optional()
      .describe('Override default resource limits. Key = item className, value = per-minute limit'),
  },
  async ({
    gameVersion, production, allowedAlternateRecipes, blockedRecipes,
    blockedResources, blockedMachines, sinkableResources, input, resourceMaxOverrides,
  }) => {
    const dataVersion: GameVersion =
      gameVersion === '0.8.0'         ? '0.8' :
      gameVersion === '1.0.0-ficsmas' ? '1.0-ficsmas' : '1.0';

    const resourceMax = {
      ...RESOURCE_AMOUNTS[dataVersion],
      ...(resourceMaxOverrides ?? {}),
    };

    // Replace MAX_SAFE_INTEGER with a large finite number for JSON serialization
    const sanitizedResourceMax: Record<string, number> = {};
    for (const [key, val] of Object.entries(resourceMax)) {
      sanitizedResourceMax[key] = val === Number.MAX_SAFE_INTEGER ? 999999999 : val;
    }

    const requestBody = {
      gameVersion,
      resourceMax:             sanitizedResourceMax,
      resourceWeight:          RESOURCE_WEIGHTS[dataVersion],
      blockedResources,
      blockedRecipes,
      allowedAlternateRecipes,
      sinkableResources,
      production,
      input,
    };

    let rawResult: Record<string, number>;
    try {
      const response = await fetch('https://api.satisfactorytools.com/v2/solver', {
        method:  'POST',
        headers: { 'Content-Type': 'application/json' },
        body:    JSON.stringify(requestBody),
      });
      if (!response.ok) {
        const text = await response.text();
        return {
          content: [{ type: 'text' as const, text: `Solver API error ${response.status}: ${text}` }],
          isError: true,
        };
      }
      const json = await response.json() as { result?: Record<string, number> };
      rawResult = json.result ?? {};
    } catch (err) {
      return {
        content: [{ type: 'text' as const, text: `Network error calling solver: ${String(err)}` }],
        isError: true,
      };
    }

    const data = gameData[dataVersion];
    // API returns keys like "Recipe_IronPlate_C@100#Desc_ConstructorMk1_C" — strip suffix before lookup
    const recipes = Object.entries(rawResult)
      .map(([rawKey, machineCount]) => ({ rawKey, recipeClass: rawKey.split('@')[0], machineCount }))
      .filter(({ recipeClass }) => recipeClass in data.recipes)
      .map(({ rawKey, recipeClass, machineCount }) => {
        const recipe = data.recipes[recipeClass];
        const buildingName = recipe.producedIn
          .map(b => data.buildings[b]?.name)
          .find(Boolean) ?? null;
        return {
          className:    recipeClass,
          rawKey,
          recipeName:   recipe.name,
          machineCount: Math.round(machineCount * 10000) / 10000,
          buildingName,
          alternate:    recipe.alternate,
        };
      })
      .sort((a, b) => b.machineCount - a.machineCount);

    return {
      content: [{
        type: 'text',
        text: JSON.stringify({
          summary: `${recipes.length} recipe(s) needed`,
          recipes,
        }, null, 2),
      }],
    };
  },
);

// ── read_sft_file ─────────────────────────────────────────────────────────────

server.tool(
  'read_sft_file',
  'Read a .sft file (SatisfactoryTools export) and return its production tabs with human-readable item/recipe names. The raw request data is included for round-tripping with write_sft_file.',
  {
    filePath: z.string().describe('Path to the .sft file'),
  },
  async ({ filePath }) => {
    let content: string;
    try {
      content = fs.readFileSync(filePath, 'utf8');
    } catch (err) {
      return { content: [{ type: 'text' as const, text: `Could not read file: ${String(err)}` }], isError: true };
    }

    // Strip comment lines and blanks, join — same logic as FileExporter.importTabs
    const dataStr = content
      .split('\n')
      .map(l => l.trim())
      .filter(l => l !== '' && l.charAt(0) !== '#')
      .join('');

    const version = dataStr.charAt(0);
    if (version !== '0') {
      return { content: [{ type: 'text' as const, text: `Unsupported .sft version: "${version}"` }], isError: true };
    }

    let parsed: ISftFileContents;
    try {
      // base64 decode → zlib inflate (pako.deflate uses zlib wrapper, compatible with Node zlib)
      const compressed = Buffer.from(dataStr.substring(1), 'base64');
      const json = zlib.inflateSync(compressed).toString('utf8');
      parsed = JSON.parse(json) as ISftFileContents;
    } catch (err) {
      return { content: [{ type: 'text' as const, text: `Failed to parse .sft file: ${String(err)}` }], isError: true };
    }

    if (parsed.type !== 'tabs') {
      return { content: [{ type: 'text' as const, text: `Invalid file type: "${parsed.type}"` }], isError: true };
    }

    const enrichedTabs = parsed.tabs.map(tab => {
      const gv = tab.metadata.gameVersion ?? '';
      const dataVersion: GameVersion = gv.startsWith('0.8') ? '0.8' : gv.includes('ficsmas') ? '1.0-ficsmas' : '1.0';
      const data = gameData[dataVersion];

      return {
        name: tab.metadata.name,
        gameVersion: tab.metadata.gameVersion,
        schemaVersion: tab.metadata.schemaVersion,
        production: tab.request.production.map(p => ({
          ...p,
          itemName: p.item ? (data.items[p.item]?.name ?? p.item) : null,
        })),
        input: tab.request.input.map(i => ({
          ...i,
          itemName: i.item ? (data.items[i.item]?.name ?? i.item) : null,
        })),
        allowedAlternateRecipes: tab.request.allowedAlternateRecipes.map(r => ({
          className: r,
          name: data.recipes[r]?.name ?? r,
        })),
        blockedRecipes:   tab.request.blockedRecipes,
        blockedResources: tab.request.blockedResources,
        blockedMachines:  tab.request.blockedMachines ?? [],
        sinkableResources: tab.request.sinkableResources,
        // Include raw request so it can be passed back to write_sft_file unchanged
        rawRequest: tab.request,
      };
    });

    return {
      content: [{
        type: 'text',
        text: JSON.stringify({ tabCount: enrichedTabs.length, tabs: enrichedTabs }, null, 2),
      }],
    };
  },
);

// ── write_sft_file ────────────────────────────────────────────────────────────

server.tool(
  'write_sft_file',
  `Write a .sft file (SatisfactoryTools export) that can be imported into the web app.
Each tab needs a name, gameVersion, and a request object. The easiest workflow is:
1. Use read_sft_file to get existing tab data (including rawRequest)
2. Modify as needed
3. Pass the tabs back here to write a new file.
To build a tab from scratch, use get_raw_resources for resourceMax/resourceWeight defaults and search_items for item classNames.`,
  {
    filePath: z.string().describe('Output path for the .sft file (will be created or overwritten)'),
    tabs: z.array(z.object({
      name:        z.string().describe('Display name for this production tab'),
      gameVersion: z.enum(['0.8.0', '1.0.0', '1.0.0-ficsmas']).default('1.0.0'),
      request: z.object({
        production: z.array(z.object({
          item:   z.string().nullable(),
          type:   z.enum(['perMinute', 'max']).default('perMinute'),
          amount: z.number().default(0),
          ratio:  z.number().default(1),
        })).default([]),
        input: z.array(z.object({
          item:   z.string().nullable(),
          amount: z.number(),
        })).default([]),
        allowedAlternateRecipes: z.array(z.string()).default([]),
        blockedRecipes:    z.array(z.string()).default([]),
        blockedResources:  z.array(z.string()).default([]),
        blockedMachines:   z.array(z.string()).default([]),
        sinkableResources: z.array(z.string()).default([]),
        resourceMax:     z.record(z.string(), z.number()).optional()
          .describe('Leave unset to use game defaults'),
        resourceWeight:  z.record(z.string(), z.number()).optional()
          .describe('Leave unset to use game defaults'),
      }),
    })).min(1),
  },
  async ({ filePath, tabs }) => {
    const productionTabs: IProductionData[] = tabs.map(tab => {
      const dataVersion: GameVersion = tab.gameVersion === '0.8.0' ? '0.8' :
        tab.gameVersion === '1.0.0-ficsmas' ? '1.0-ficsmas' : '1.0';

      const resourceMax = tab.request.resourceMax ?? RESOURCE_AMOUNTS[dataVersion];
      const resourceWeight = tab.request.resourceWeight ?? RESOURCE_WEIGHTS[dataVersion];

      // Sanitize MAX_SAFE_INTEGER for JSON
      const sanitizedMax: Record<string, number> = {};
      for (const [k, v] of Object.entries(resourceMax)) {
        sanitizedMax[k] = v === Number.MAX_SAFE_INTEGER ? 999999999 : v;
      }

      return {
        metadata: {
          name:          tab.name,
          icon:          null,
          schemaVersion: 1,
          gameVersion:   tab.gameVersion,
        },
        request: {
          resourceMax:             sanitizedMax,
          resourceWeight,
          blockedResources:        tab.request.blockedResources,
          blockedRecipes:          tab.request.blockedRecipes,
          blockedMachines:         tab.request.blockedMachines,
          allowedAlternateRecipes: tab.request.allowedAlternateRecipes,
          sinkableResources:       tab.request.sinkableResources,
          production:              tab.request.production,
          input:                   tab.request.input,
        },
      };
    });

    // Build file content — same format as FileExporter.exportTabs
    const payload: ISftFileContents = { type: 'tabs', tabs: productionTabs };
    const compressed = zlib.deflateSync(JSON.stringify(payload));
    const b64 = Buffer.from(compressed).toString('base64');

    const tabList = productionTabs.map(t => `# - ${t.metadata.name ?? 'Unnamed'}`).join('\n');
    const fileContent = [
      '# Satisfactory Tools export (version 1)',
      '',
      '# Contains these production lines:',
      tabList,
      '',
      '0' + b64,
      '',
      `# Exported on ${new Date().toISOString()}`,
      '',
    ].join('\n');

    try {
      fs.mkdirSync(path.dirname(path.resolve(filePath)), { recursive: true });
      fs.writeFileSync(filePath, fileContent, 'utf8');
    } catch (err) {
      return { content: [{ type: 'text' as const, text: `Failed to write file: ${String(err)}` }], isError: true };
    }

    return {
      content: [{
        type: 'text',
        text: JSON.stringify({
          written:  filePath,
          tabCount: productionTabs.length,
          tabs:     productionTabs.map(t => t.metadata.name),
        }, null, 2),
      }],
    };
  },
);

// ─── Bootstrap ────────────────────────────────────────────────────────────────

async function main() {
  const transport = new StdioServerTransport();
  await server.connect(transport);
  // Use stderr only — stdout is owned by the MCP protocol after connect
  process.stderr.write('SatisfactoryTools MCP server started\n');
}

main().catch(err => {
  process.stderr.write(`Fatal: ${String(err)}\n`);
  process.exit(1);
});
