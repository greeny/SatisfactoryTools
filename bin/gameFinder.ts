import * as vdf from '@node-steam/vdf';
import * as fs from 'fs';
import * as Path from 'path';
import { enumerateValues, HKEY, RegistryValueType } from 'registry-js';

export type Channel = 'experimental' | 'earlyaccess';
export const isChannel = (obj: any): obj is Channel => {
	return obj === 'experimental' || obj === 'earlyaccess';
};

export interface IGameFinderOptions {
	/** Satisfactory update channel */
	channel: Channel;

	/** true to only look for the game in Steam paths */
	onlySteam: boolean;

	/** true to only look for the game in Epic Games paths */
	onlyEpic: boolean;

	/** if defined, do not use the Windows registry to find the Steam library paths, just use this value */
	steamLibraryPath?: string;

	/** if defined, do not use the Windows registry to find the Epic Games 'Manifests' directory, just use this value */
	epicManifestsPath?: string;
}

export class GameFinder {
	public static findGame(options: IGameFinderOptions): string {
		if (!options.onlyEpic) {
			try {
				return GameFinder.getSteamGamePath(options.channel, options.steamLibraryPath);
			} catch (error) {
				if (options.onlySteam) throw error;
			}
		}
		if (!options.onlySteam)
			return GameFinder.getEpicGamesPath(options.channel, options.epicManifestsPath);

		throw new Error('Invalid options. Must specify either useSteam=true, useEpic=true, or both.')
	}

	private static getRegistryString = (path: string, valueName: string): string | undefined => {
		const ucName = valueName.toLocaleUpperCase();
		for (const value of enumerateValues(HKEY.HKEY_LOCAL_MACHINE, path)) {
			if (value.name.toLocaleUpperCase() === ucName && value.type === RegistryValueType.REG_SZ)
				return value.data;
		}
		return undefined;
	};

	private static findWindowsSteamLibrariesVdf(): string {
		const steamPath = GameFinder.getRegistryString('SOFTWARE\\WOW6432Node\\Valve\\Steam', 'InstallPath');
		if (!steamPath) throw new Error("Steam is not installed properly.");

		// Steam can have multiple library locations, which are in the VDF format in a known location.
		const librariesVdf = Path.join(steamPath, 'steamapps', 'libraryfolders.vdf');

		return librariesVdf;
	}

	private static findWindowsEpicManifests(): string {
		const appDataPath = GameFinder.getRegistryString('SOFTWARE\\WOW6432Node\\Epic Games\\EpicGamesLauncher', 'AppDataPath');
		if (!appDataPath) {
			throw new Error('Epic Games registry entry not found');
		}

		return Path.join(appDataPath, 'Manifests');
	}

	private static getEpicGamesPath(channel: Channel, manifestsFolder?: string): string {
		// This is the Epic Games catalog item id for the Experimental fork of Satisfactory.
		// We could use DisplayName, but that would be less accurate.
		const catalogIds: Record<Channel, string> = {
			experimental: 'ef4a63daa7d4420e91420a72050be89d',
			earlyaccess: 'b915dfe8dcf74770841c82a4162dc954'
		};

		const catalogId = catalogIds[channel];

		// in the Manifests folder, there will be one .item file per installed game.
		manifestsFolder = manifestsFolder || this.findWindowsEpicManifests();

		if (!fs.existsSync(manifestsFolder)) {
			throw new Error(`Epic Games manifests directory '${manifestsFolder}' does not exist`);
		}

		for (const itemFileName of fs.readdirSync(manifestsFolder)) {
			if (!itemFileName.endsWith('.item')) continue;
			const itemPath = Path.join(manifestsFolder, itemFileName);

			// Epic's manifests are in JSON format. Games are keyed by the catalog item id.
			const manifest = JSON.parse(fs.readFileSync(itemPath, { encoding: 'utf8' }));
			if (manifest?.CatalogItemId === catalogId)
				return manifest.InstallLocation;
		}
		throw new Error('Could not find installed game in any Epic Games library');
	}

	private static getSteamGamePath(channel: Channel, librariesVdf?: string): string {
		// look in the Windows registry to find Steam's installation path
		const steamAppId = '526870';

		librariesVdf = librariesVdf || this.findWindowsSteamLibrariesVdf();

		if (!fs.existsSync(librariesVdf)) throw new Error(`${librariesVdf} does not exist.`);

		const manifest = vdf.parse(fs.readFileSync(librariesVdf, { encoding: 'utf8' }));
		if (!manifest?.libraryfolders) throw new Error(`No libraryfolders in Steam VDF at ${librariesVdf}`);

		// find the library that contains the Satisfactory game
		for (const k in manifest.libraryfolders) {
			if (!manifest.libraryfolders.hasOwnProperty(k) ||
				typeof manifest.libraryfolders[k] !== 'object') continue;
			const library = manifest.libraryfolders[k];

			// sanity checking...
			if (!library || typeof library !== 'object') continue;
			if (!library.path || !fs.existsSync(library.path)) continue;
			if (!library.apps || typeof library.apps !== 'object') continue;

			// if the library contains the game, this will be present.
			if (library.apps[steamAppId] === undefined) continue;

			// Steam thinks the game is installed, so look for the game's local install path in its VDF manifest.
			const appManifestPath = Path.join(library.path, 'steamapps', `appmanifest_${steamAppId}.acf`);
			if (!fs.existsSync(appManifestPath)) continue;

			// the manifest exists, so parse it
			const appManifest = vdf.parse(fs.readFileSync(appManifestPath, { encoding: 'utf8' })) as SteamAppManifest;

			// verify that this is the correct channel
			if (getSteamChannel(appManifest) !== channel) continue;

			const installdir = appManifest?.AppState?.installdir;
			if (!installdir) continue;

			// Steam thinks the game is installed in this library, but sanity check that it actually still exists.
			const installPath = Path.join(library.path, 'SteamApps', 'common', installdir);
			if (!fs.existsSync(installPath)) continue;

			return installPath;
		}

		throw new Error('Could not find installed game in any Steam library');
	}
}

interface SteamAppManifest {
	AppState: {
		appid: string;
		installdir?: string;
		UserConfig?: {
			betakey?: string
		}
	};
}

const getSteamChannel = (appManifest: SteamAppManifest): Channel => {
	return appManifest.AppState.UserConfig?.betakey === 'experimental'
		? 'experimental'
		: 'earlyaccess';
};