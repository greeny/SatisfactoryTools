import {IWindowService} from 'angular';

/**
 * Pointer to the new Satisfactory Tools, which replaced this app at the site root; this old version is served
 * from a subfolder for a while. There is no plan handover: the new tools read this app's localStorage themselves
 * (same origin), so all that is left here is the link target and the usage tracking.
 */
export class NewToolsService
{

	// the new tools live at the root of the same host; a root-absolute path still resolves to the root under <base href="/old/">
	public static readonly NEW_TOOLS_URL = '/';

	// whether the navbar item and the banner pointing at the new tools are shown; off while this app is only being
	// moved to its subfolder (the root is still this app, so there is nothing to point at yet), on once the new
	// tools answer at the root - flip it and deploy
	public static readonly PROMOTE_NEW_TOOLS = true;

	public static $inject = ['$window'];

	public constructor(
		private readonly $window: IWindowService,
	)
	{
	}

	/**
	 * Matomo events let us watch how the move goes; the tracker is loaded by index.php and may be missing (blocked).
	 */
	public track(action: string, value?: number): void
	{
		const paq = (this.$window as any)._paq;
		if (paq && typeof paq.push === 'function') {
			paq.push(['trackEvent', 'NewTools', action, undefined, value]);
		}
	}

}
