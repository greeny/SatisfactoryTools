import * as vdf from '@node-steam/vdf';
import * as fs from 'fs';
import * as Path from 'path';
import { enumerateValues, HKEY, RegistryValueType } from 'registry-js';

export class GameFinder {
	public static findGame(): string | undefined {
		return GameFinder.getEpicGamesPath() ?? GameFinder.getSteamPath();
	}

	private static getRegistryString = (path: string, valueName: string): string | undefined => {
		const ucName = valueName.toLocaleUpperCase();
		for (const value of enumerateValues(HKEY.HKEY_LOCAL_MACHINE, path)) {
			if (value.name.toLocaleUpperCase() === ucName) {
				if (value.type === RegistryValueType.REG_SZ) {
					return value.data;
				}
			}
		}
		return undefined;
	};

	private static getEpicGamesPath(): string | undefined {
		// This is the Epic Games catalog item id for the Experimental fork of Satisfactory.
		// We could use DisplayName, but that would be less accurate.
		const experimentalCatalogId = 'ef4a63daa7d4420e91420a72050be89d';

		// in the Manifests folder, there will be one .item file per installed game.
		const appDataPath = GameFinder.getRegistryString('SOFTWARE\\WOW6432Node\\Epic Games\\EpicGamesLauncher', 'AppDataPath');
		if (!appDataPath) {
			console.debug('Epic Games registry entry not found');
			return undefined;
		}

		const manifestsPath = Path.join(appDataPath, 'Manifests');
		if (!fs.existsSync(manifestsPath)) {
			console.debug(`Epic Games manifests directory '${manifestsPath}' does not exist`);
			return undefined;
		}

		for (const itemFileName of fs.readdirSync(manifestsPath)) {
			const itemPath = Path.join(manifestsPath, itemFileName);

			// Epic's manifests are in JSON format. Games are keyed by the catalog item id.
			const manifest = JSON.parse(fs.readFileSync(itemPath, { encoding: 'utf8' }));
			if (manifest?.CatalogItemId === experimentalCatalogId) {
				const installPath = manifest.InstallLocation;

				// Epic thinks the game is installed, but sanity check that
				if (!fs.existsSync(installPath)) {
					console.debug(`Epic Games thinks the game is installed at '${installPath}', but that path does not exist`);
					return undefined;
				}

				return installPath;
			}
		}

		return undefined;
	}

	private static getSteamPath(): string | undefined {
		// look in the Windows registry to find Steam's installation path
		const steamPath = GameFinder.getRegistryString('SOFTWARE\\WOW6432Node\\Valve\\Steam', 'InstallPath');

		const steamAppId = '526870';
		if (!steamPath) return undefined;

		// Steam can have multiple library locations, which are in the VDF format in a known location.
		const libraryFoldersPath = Path.join(steamPath, 'steamapps', 'libraryfolders.vdf');
		if (!fs.existsSync(libraryFoldersPath)) return undefined;

		const manifest = vdf.parse(fs.readFileSync(libraryFoldersPath, { encoding: 'utf8' }));
		if (!manifest?.libraryfolders) return undefined;

		// find the library that contains the Satisfactory game
		for (const k in manifest.libraryfolders) {
			if (!manifest.hasOwnProperty(k)) continue;
			const library = manifest.libraryfolders[k];

			// sanity checking...
			if (!library || typeof library !== 'object') continue;
			if (!library.path || !fs.existsSync(library.path)) continue;
			if (!library.apps || typeof library.apps !== 'object') continue;

			// if the library contains the game, this will be present.
			if (!library.apps[steamAppId]) continue;

			// Steam thinks the game is installed, so look for the game's local install path in its VDF manifest.
			const appManifestPath = Path.join(library.path, 'SteamApps', `appmanifest_${steamAppId}.acf`);
			if (!fs.existsSync(appManifestPath)) continue;

			// the manifest exists, so parse it
			const appManifest = vdf.parse(fs.readFileSync(appManifestPath, { encoding: 'utf8' }));

			const installdir = appManifest?.AppState?.installdir;
			if (!installdir) continue;

			// Steam thinks the game is installed in this library, but sanity check that it actually still exists.
			const installPath = Path.join(library.path, 'SteamApps', 'common', installdir);
			if (!fs.existsSync(installPath)) continue;

			return installPath;
		}

		return undefined;
	}
}