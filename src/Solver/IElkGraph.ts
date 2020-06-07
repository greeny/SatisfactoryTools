import {ElkGraphElement, ElkNode, ElkPrimitiveEdge} from 'elkjs';

export interface IElkGraph extends ElkGraphElement
{

	children: ElkNode[];
	edges: ElkPrimitiveEdge[];

}
