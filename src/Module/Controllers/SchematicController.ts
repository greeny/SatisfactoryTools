import data from '@src/Data/Data';
import {ITransitionObject} from '@src/Types/ITransitionObject';
import {IRecipeSchema} from '@src/Schema/IRecipeSchema';
import {ISchematicSchema} from '@src/Schema/ISchematicSchema';
import {default as angular, IScope} from 'angular';
import {SchematicFiltersService} from '@src/Module/Services/SchematicFiltersService';
import {Strings} from '@src/Utils/Strings';
import {IItemSchema} from '@src/Schema/IItemSchema';
import ELK from 'elkjs/lib/elk.bundled';
import {IElkGraph} from '@src/Solver/IElkGraph';
import {Edge, Network, Node} from 'vis-network';

export class SchematicController
{

	public schematic: ISchematicSchema;
	public static $inject = ['$state', '$transition$', 'SchematicFiltersService', '$scope'];

	private nodeWidth = 300;
	private nodeHeight = 100;

	public constructor($state: any, $transition$: ITransitionObject<{item: string}>, private schematicFiltersService: SchematicFiltersService, private $scope: IScope)
	{
		const currentSchematic = data.getSchematicBySlug($transition$.params().item);
		if (currentSchematic === null) {
			$state.go($state.current.parent);
			return;
		}
		this.schematic = currentSchematic;
		this.schematicFiltersService.filter.query = this.schematic.name;
		this.$scope.$watch(() => {
			return this.schematicFiltersService.filter.query;
		}, (newValue) => {
			if (newValue !== currentSchematic.name) {
				$state.go($state.current.parent);
			}
		});

		const schematics = data.getRelevantSchematics(currentSchematic);

		const elk = new ELK();
		const elkGraph: IElkGraph = {
			id: 'root',
			layoutOptions: {
				'elk.algorithm': 'org.eclipse.elk.conn.gmf.layouter.Draw2D',
				'org.eclipse.elk.spacing.nodeNode': 40 + '',
			},
			children: [],
			edges: [],
		};

		const nodes: Node[] = [];
		const edges: Edge[] = [];

		const schematicMapping: {[key: string]: number} = {};
		let id = 1;

		for (const key in schematics) {
			const schematic = schematics[key];
			const node: any = {
				id: id,
				label: '<b>' + schematic.name + '</b>\nTier: ' + schematic.tier,
				slug: schematic.slug,
			};
			if (schematic.className === currentSchematic.className) {
				node.color = '#5cb85c';
			}
			nodes.push(node as Node);
			elkGraph.children.push({
				id: id.toString(),
				width: this.nodeWidth,
				height: this.nodeHeight,
			});
			schematicMapping[schematic.className] = id;
			id++;
		}

		for (const schematic of schematics) {
			for (const dependency of schematic.requiredSchematics) {
				if ((dependency in schematicMapping) && (schematic.className in schematicMapping)) {
					edges.push({
						from: schematicMapping[dependency],
						to: schematicMapping[schematic.className],
					});
					elkGraph.edges.push({
						id: id.toString(),
						source: schematicMapping[dependency].toString(),
						target: schematicMapping[schematic.className].toString(),
					});
					id++;
				}
			}
		}

		elk.layout(elkGraph).then((elkData) => {
			nodes.forEach((node) => {
				if (elkData.children) {
					for (const item of elkData.children) {
						if (parseInt(item.id, 10) === node.id) {
							node.x = item.x;
							node.y = item.y;
							return;
						}
					}
				}
			});

			const network = new Network(angular.element('#schematic-tree')[0], {
				nodes: nodes,
				edges: edges,
			}, {
				edges: {
					labelHighlightBold: false,
					color: '#697d91',
					font: {
						size: 14,
						multi: 'html',
						color: '#eeeeee',
						strokeColor: 'rgba(0, 0, 0, 0.2)',
					},
					arrows: 'to',
					smooth: false,
				},
				nodes: {
					labelHighlightBold: false,
					font: {
						size: 14,
						multi: 'html',
						color: '#eeeeee',
					},
					color: {
						background: '#df691a',
						border: 'rgba(0,0,0,0)',
						highlight: {
							background: '#e77a31',
							border: '#eeeeee',
						},
					},
					margin: {
						top: 10,
						left: 10,
						right: 10,
						bottom: 10,
					},
					shape: 'box',
				},
				physics: {
					enabled: false,
				},
				layout: {
					hierarchical: false,
				},
			});

			network.on('doubleClick', (params) => {
				if (params.nodes.length === 1) {
					let node: any;
					for (node of nodes) {
						if (node.id === params.nodes[0]) {
							if (node.slug) {
								$state.go('schematic', {item: node.slug});
							}
						}
					}
				}
			});
		});
	}

	public getSchematic(className: string): ISchematicSchema|null
	{
		return data.getSchematicByClassName(className);
	}

	public getItem(className: string): IItemSchema|null
	{
		return data.getItemByClassName(className);
	}

	public getRecipe(className: string): IRecipeSchema|null
	{
		return data.getRecipeByClassName(className);
	}

	public getSchematicType(type: string): string
	{
		return Strings.convertSchematicType(type);
	}

	public resetFilter(): void
	{
		this.schematicFiltersService.resetFilters();
	}

}
