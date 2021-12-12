export type PlatformName = 'madiator.com' | 'odysee' | 'app' 

export interface PlatformSettings
{
  domainPrefix: string
  display: string
  theme: string
}

export const platformSettings: Record<PlatformName, PlatformSettings> = {
  'madiator.com': { domainPrefix: 'https://madiator.com/', display: 'Madiator.com', theme: '#075656' },
  odysee: { domainPrefix: 'https://odysee.com/', display: 'Odysee', theme: '#1e013b' },
  app: { domainPrefix: 'lbry://', display: 'App', theme: '#075656' },
};

export const getPlatfromSettingsEntiries = () => {
  return Object.entries(platformSettings) as any as [Extract<keyof typeof platformSettings, string>, PlatformSettings][]
}

export interface LbrySettings {
  enabled: boolean
  platform: PlatformName
}

export const DEFAULT_SETTINGS: LbrySettings = { enabled: true, platform: 'odysee' };

export function getSettingsAsync<K extends Array<keyof LbrySettings>>(...keys: K): Promise<Pick<LbrySettings, K[number]>> {
  return new Promise(resolve => chrome.storage.local.get(keys, o => resolve(o as any)));
}
