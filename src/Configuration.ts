import config from '@src/../env.json';

export class Configuration
{

	public static getApiUrl(): string
	{
		return Configuration.getConfig().apiUrl;
	}

	private static getConfig(): IConfiguration
	{
		return config;
	}

}

interface IConfiguration
{

	apiUrl: string;

}
