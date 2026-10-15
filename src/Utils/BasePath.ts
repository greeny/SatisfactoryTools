/**
 * The app is served from the site root (/) or from a subfolder (/old/, an Apache alias); index.php emits the
 * matching <base href>. $location and relative asset URLs honour it on their own, this is for the places that
 * look at the raw document location.
 */
export class BasePath
{

	/**
	 * Base path with leading and trailing slash, e.g. "/" or "/old/".
	 */
	public static get(): string
	{
		const baseElement = document.querySelector('base');
		let base = '/';
		try {
			base = new URL(baseElement && baseElement.href ? baseElement.href : document.baseURI).pathname;
		} catch (e) {
			base = '/';
		}
		if (!base.startsWith('/')) {
			base = '/' + base;
		}
		if (!base.endsWith('/')) {
			base += '/';
		}
		return base;
	}

	/**
	 * Path of the document relative to the base, always starting with a slash: "/old/1.0/production" -> "/1.0/production", "/old/" -> "/".
	 */
	public static strip(pathname: string): string
	{
		const base = BasePath.get();
		let path = pathname;
		if (base !== '/' && path.startsWith(base)) {
			path = path.substring(base.length - 1);
		} else if (base !== '/' && path + '/' === base) {
			path = '/';
		}
		return path.startsWith('/') ? path : '/' + path;
	}

}
