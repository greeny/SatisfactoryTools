import { Numbers } from '@src/Utils/Numbers';
import { CalcCompleted } from './CalcCompleted';
import { GraphNode, HighlightState } from './Nodes/GraphNode';
import { RecipeNode } from './Nodes/RecipeNode';

export class CalcHighlight extends CalcCompleted {
	private cache: NodeCache = { };

	public set(node: GraphNode) {
		if (this.graph.highlightedNode === node) {
			this.graph.highlightedNode = undefined;
			this.graph.highlightedLimit = undefined;
		} else {
			this.graph.highlightedNode = node;

			if (this.graph.highlightedNode instanceof RecipeNode) {
				const recipeNode = (node as RecipeNode);
				this.graph.highlightedLimit = recipeNode.limit || recipeNode.recipeData.amount;
			}
		}

		this.update();
	}

	public toggle(node: GraphNode) {
		node.userIgnore = !node.userIgnore;

		this.update();
	}

	public update() {
		super.resetConsumed();

		if (!this.graph.highlightedNode) {
			for (const n of this.graph.nodes) {
				n.userIgnore = false;
				n.highlighted = undefined;
			}
		} else {
			for (const n of this.graph.nodes) {
				this.cache[n.id] = this.cache[n.id] || {};
				const cache = this.cache[n.id];
				cache.highlighted = n.highlighted;

				n.highlighted = 'unrelated';
			}

			this.graph.highlightedNode.highlighted = 'highlighted';

			this.setHighlighted(this.graph.highlightedNode, true, true);

			if (this.graph.settings.showHighlightLimits) {
				if (this.graph.highlightedNode instanceof RecipeNode) {
					const recipeNode = this.graph.highlightedNode as RecipeNode;
					const limit = this.graph.highlightedLimit || recipeNode.limit || 0;
					this.setNodeLimit(this.graph.highlightedNode, limit);
				}

				if (this.graph.settings.showHighlightDependents) {
					for (const node of this.graph.nodes) {
						if (node instanceof RecipeNode) {
							const recipeNode = node as RecipeNode;
							if (recipeNode.highlighted === 'dependent') {
								this.setNodeLimit(node, node.recipeData.amount);
							}
						}
					}
				}
			}
		}

		super.updateInternal();
		super.updateVisibility();
	}

	private setHighlighted(node: GraphNode, showDependencies: boolean, showDependents: boolean): void {
		this.cache[node.id] = this.cache[node.id] || { }

		const cache = this.cache[node.id];

		if (	(!showDependents || (showDependents === cache.showDependents))
			&& 	(!showDependencies || (showDependencies === cache.showDependencies))) {
			return;
		}

		if (showDependents) {
			cache.showDependents = true;

			for (const edge of node.getEdgesOut()) {
				if (edge.to.highlighted === 'unrelated') {
					const oldState = this.cache[edge.to.id]?.highlighted;

					if (node.highlighted === 'highlighted'
						&& (oldState === undefined
							|| oldState === 'dependency'
							|| oldState === 'highlighted'
							|| oldState === 'product'))
					{
						edge.to.highlighted = 'product';
					} else if (this.graph.settings.showHighlightDependents) {
						edge.to.highlighted = 'dependent';
					}
				}

				this.setHighlighted(edge.to, false, false);
			}
		}

		if (showDependencies) {
			cache.showDependencies = true;

			for (const edge of node.getEdgesIn()) {
				if (edge.from.highlighted === 'unrelated' || edge.from.highlighted === 'dependent') {
					edge.from.highlighted = 'dependency';
				}

				this.setHighlighted(edge.from, true, edge.from instanceof RecipeNode);
			}
		}
	}

	private setNodeLimit(node: RecipeNode, limit: number): void {
		const diff = limit - (node.limit || 0);
		if (Numbers.floor(diff) <= 0 || node.userIgnore) {
			return;
		}

		node.limit = limit;

		const multiplier = node.getMultiplier(diff);

		if (node.highlighted === 'highlighted' || node.highlighted === 'dependent' || node.highlighted === 'dependency') {
			for (const input of node.getInputs()) {
				const ingredient = node.recipeData.recipe.ingredients.find((x) => x.item === input.resource.className);
				if (!ingredient) {
					continue;
				}

				let inputAmount = ingredient.amount * multiplier;

				for (const edge of node.getEdgesIn(input.resource.className)) {
					if (!edge.from.isAvailable()) {
						continue;
					}

					const consumed = edge.itemAmount.increaseLimit(inputAmount);
					inputAmount -= consumed;
				}
			}

			for (const edge of node.getEdgesIn()) {
				if (edge.from instanceof RecipeNode) {
					this.updateNodeLimit(edge.from);
				}
			}
		}

		if (node.highlighted === 'highlighted') {
			for (const output of node.getOutputs()) {
				const product = node.recipeData.recipe.products.find((x) => x.item === output.resource.className);
				if (!product) {
					continue;
				}

				let outputAmount = product.amount * multiplier;

				for (const edge of node.getEdgesOut(output.resource.className)) {
					if (edge.to.highlighted !== 'product') {
						continue;
					}

					outputAmount -= edge.itemAmount.increaseLimit(outputAmount);
				}
			}

			for (const edge of node.getEdgesOut()) {
				if (edge.to instanceof RecipeNode) {
					this.updateNodeLimit(edge.to);
				}
			}
		}
	}

	private updateNodeLimit(node: RecipeNode): void {
		if (this.cache[node.id]?.visited) {
			return;
		}

		this.cache[node.id] = this.cache[node.id] || {};
		const cache = this.cache[node.id];
		cache.visited = true;

		if (node.highlighted === 'product') {
			const inputsUsed = node.getInputs().map((input) => {
				const limit = node
					.getEdgesIn(input.resource.className)
					.map((edge) => edge.from.isAvailable()
						? (edge.itemAmount.limit || 0)
						: edge.itemAmount.amount)
					.reduce((acc, sum) => acc + sum, 0);
				const total = input.maxAmount;

				return limit / total;
			});
			const inputUsed = Math.min(...inputsUsed);
			const inputLimit = inputUsed * node.recipeData.amount;

			this.setNodeLimit(node, inputLimit);
		} else if (node.highlighted !== 'unrelated') {
			const outputsUsed = node.getOutputs().map((output) => {
				const limit = node
					.getEdgesOut(output.resource.className)
					.map((edge) => edge.to.isAvailable()
						? (edge.itemAmount.limit || 0)
						: 0)
					.reduce((acc, sum) => acc + sum, 0);
				const total = output.maxAmount;

				return limit / total;
			});
			const outputUsed = Math.max(...outputsUsed);
			const outputLimit = outputUsed * node.recipeData.amount;

			this.setNodeLimit(node, outputLimit);
		}

		cache.visited = false;
	}
}

interface NodeState {
	visited?: boolean,
	highlighted?: HighlightState,
	showDependents?: boolean;
	showDependencies?: boolean;
}

interface NodeCache {
	[key:number]: NodeState;
}
