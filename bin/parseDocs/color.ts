import {IColorSchema} from '@src/Schema/IColorSchema';

export default function parseColor(color: {
	R: string;
	B: string;
	G: string;
	A: string;
}): IColorSchema
{
	return {
		r: parseInt(color.R),
		g: parseInt(color.G),
		b: parseInt(color.B),
		a: parseInt(color.A),
	}
}
