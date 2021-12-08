declare module 'cytoscape-node-html-label'
{
	import * as CyTypes from 'cytoscape';

	export type IHAlign = 'left' | 'center' | 'right';
	export type IVAlign = 'top' | 'center' | 'bottom';

	export interface CytoscapeNodeHtmlParams {
		query?: string;
		halign?: IHAlign;
		valign?: IVAlign;
		halignBox?: IHAlign;
		valignBox?: IVAlign;
		cssClass?: string;
		tpl?: (d: any) => string;
	}

	export interface CytoscapeContainerParams {
		enablePointerEvents?: boolean;
	}

	const register: (cy: CyTypes.Core) => void;
	export namespace cytoscape {
		interface Core {
			cyNodeHtmlLabel: (_cy: CyTypes.Core, params: CytoscapeNodeHtmlParams[], options?: CytoscapeContainerParams) => void;
		}
	}

	export default register;
}

declare module 'cytoscape-elk' {}
