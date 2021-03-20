interface ISortable {
	slug: string;
}

export class Sort {
	public static sortBySlug(a: ISortable, b: ISortable): number {
		return a.slug > b.slug ? 1 : -1;
	}
}
