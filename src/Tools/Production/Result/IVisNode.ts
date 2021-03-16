export interface IVisNode
{
	id: number;
	label: string;
	title?: string;
	color?: {
		border: string,
		background: string,
		highlight: {
			border: string,
			background: string,
		},
	};
	font?: {
		color: string,
		align?: string,
	};
	x?: number;
	y?: number;
	type?: string;
}
