import { Numbers } from '@src/Utils/Numbers';
import { Graph } from './Graph';
import { ByproductNode } from './Nodes/ByproductNode';
import { ProductNode } from './Nodes/ProductNode';
import { RecipeNode } from './Nodes/RecipeNode';
import { SinkNode } from './Nodes/SinkNode';

export class CalcCompleted {
	private indent: number = 0;

	public constructor(protected readonly graph: Graph) { }

	public update() {
		this.resetConsumed();
		this.updateInternal();
		this.updateVisibility();
	}

	protected updateInternal() {
		if (this.graph.settings.applyCompleted) {
			for (const node of this.graph.nodes) {
				if (node instanceof RecipeNode) {
					if (this.graph.completedMap[node.recipeData.recipe.className]) {
						this.updateNodeCompletion(node);
					}
				}
			}
		}
	}

	protected resetConsumed() {
		for (const node of this.graph.nodes) {
			if (node instanceof RecipeNode) {
				(node as RecipeNode).completed = 0;
				(node as RecipeNode).limit = undefined;
			}

			for (const edge of node.connectedEdges) {
				edge.itemAmount.consumed = 0;
				edge.itemAmount.limit = undefined;
			}
		}
	}

	protected updateVisibility() {
		for (const node of this.graph.nodes) {
			const output = Numbers.round(node
				.getEdgesOut()
				.map((x) => x.itemAmount.getAvailable())
				.reduce((acc, sum) => acc + sum, 0));

			node.visible = node.highlighted !== 'unrelated'
				&& (this.graph.settings.showDisabledNodes || !node.userIgnore)
				&& (this.graph.settings.showCompleted
					|| output > 0
					|| node instanceof ProductNode
					|| node instanceof SinkNode
					|| node instanceof ByproductNode
					|| node.highlighted === 'product'
					|| node.highlighted === 'dependent');
		}
	}

	private updateNodeCompletion(node: RecipeNode): void {
		const indent = '   |'.repeat(this.indent)
		const outputsUsed = node.getOutputs().map((output) => {
			let consumed = 0;
			let total = 0;

			for (const edge of node.getEdgesOut(output.resource.className)) {
				if (edge.to.isAvailable() && !edge.isLoop()) {
					consumed += edge.itemAmount.consumed;
					total += edge.itemAmount.getAmount();
				}
			}

			return total === 0
				? 1.0
				: consumed / total;
		});

		const outputUsed = Math.min(...outputsUsed);
		const outputCompleted = outputUsed * node.getAmount();

		const userCompleted = this.graph.completedMap[node.recipeData.recipe.className] || 0.0;

		const completedTotal = Math.min(outputCompleted + userCompleted, node.getAmount());

		this.setNodeCompleted(node, completedTotal);
	}

	private setNodeCompleted(node: RecipeNode, completed: number) {
		const diff = completed - node.completed;
		if (Numbers.floor(diff) <= 0) {
			return;
		}

		node.completed = completed;
		const inputs = node.getInputs();
		const multiplier = node.getMultiplier(diff);

		for (const input of inputs) {
			const ingredient = node.recipeData.recipe.ingredients.find((x) => x.item === input.resource.className);
			if (!ingredient) {
				continue;
			}

			const edges = node.getEdgesIn(input.resource.className);
			const inputAmount = ingredient.amount * multiplier;
			const totalAvailable = edges
				.map((edge) => edge.from.isAvailable()
					? edge.itemAmount.getAvailable()
					: 0.0)
				.reduce((acc, sum) => acc + sum, 0);

			if (totalAvailable <= 0) {
				continue;
			}

			for (const edge of edges) {
				if (!edge.from.isAvailable()) {
					continue;
				}

				const edgeAvailable = edge.itemAmount.getAvailable();
				const ratio = edgeAvailable / totalAvailable;
				const relativeEdgeAmount = ratio * inputAmount;
				const consumed = edge.itemAmount.increaseConsumed(relativeEdgeAmount);
			}
		}

		for (const edge of node.getEdgesIn()) {
			if (	edge.from.isAvailable()
				&&  edge.to !== edge.from
				&& 	edge.from instanceof RecipeNode)
			{
				this.indent += 1;
				this.updateNodeCompletion(edge.from);
				this.indent -= 1;
			}
		}
	}
}
