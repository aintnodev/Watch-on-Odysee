export interface ExtensionSettings {
  redirect: boolean
  targetPlatform: TargetPlatformName
  urlResolver: YTUrlResolverName
}

export const DEFAULT_SETTINGS: ExtensionSettings = { redirect: true, targetPlatform: 'odysee', urlResolver: 'lbryInc' };

export function getExtensionSettingsAsync(): Promise<ExtensionSettings> {
  return new Promise(resolve => chrome.storage.local.get(o => resolve(o as any)));
}



export type TargetPlatformName = 'madiator.com' | 'odysee' | 'app' 
export interface TargetPlatformSettings {
  domainPrefix: string
  displayName: string
  theme: string
}

export const targetPlatformSettings: Record<TargetPlatformName, TargetPlatformSettings> = {
  'madiator.com': { 
    domainPrefix: 'https://madiator.com/', 
    displayName: 'Madiator.com', 
    theme: '#075656' 
  },
  odysee: { 
    domainPrefix: 'https://odysee.com/', 
    displayName: 'Odysee', 
    theme: '#1e013b' 
  },
  app: { 
    domainPrefix: 'lbry://', 
    displayName: 'LBRY App', 
    theme: '#075656' 
  },
};

export const getTargetPlatfromSettingsEntiries = () => {
  return Object.entries(targetPlatformSettings) as any as [Extract<keyof typeof targetPlatformSettings, string>, TargetPlatformSettings][]
}



export type SourcePlatfromName = 'youtube.com' | 'yewtu.be'
export interface SourcePlatfromSettings {
  hostnames: string[]
  htmlQueries: {
    mountButtonBefore: string,
    videoPlayer: string
  }
}

export const sourcePlatfromSettings: Record<SourcePlatfromName, SourcePlatfromSettings> = {
  "yewtu.be": {
    hostnames: ['yewtu.be'],
    htmlQueries: {
      mountButtonBefore: '#watch-on-youtube',
      videoPlayer: '#player-container video'
    }
  },
  "youtube.com": {
    hostnames: ['www.youtube.com'],
    htmlQueries: {
      mountButtonBefore: 'ytd-video-owner-renderer~#subscribe-button',
      videoPlayer: '#ytd-player video'
    }
  }
}

export function getSourcePlatfromSettingsFromHostname(hostname: string) {
  const values = Object.values(sourcePlatfromSettings)
  for (const settings of values)
    if (settings.hostnames.includes(hostname)) return settings
  return null
}


export type YTUrlResolverName = 'lbryInc' | 'madiatorScrap' 

export const Keys = Symbol('keys')
export const Values = Symbol('values')
export const SingleValueAtATime = Symbol()
export type YtUrlResolveResponsePath = (string | number | typeof Keys | typeof Values)[]
export interface YtUrlResolveFunction
{
  pathname: string
  paramName: string
  paramArraySeperator: string | typeof SingleValueAtATime
  responsePath: YtUrlResolveResponsePath
}
export interface YTUrlResolver
{
  name: string
  hostname: string
  functions: {
    getChannelId: YtUrlResolveFunction
    getVideoId: YtUrlResolveFunction
  }
}

export const ytUrlResolversSettings: Record<YTUrlResolverName, YTUrlResolver> = {
  lbryInc: {
    name: "LBRY Inc.",
    hostname: "api.odysee.com",
    functions: {
      getChannelId : {
        pathname: "/yt/resolve",
        paramName: "channel_ids",
        paramArraySeperator: ',',
        responsePath: ["data", "channels", Values]
      },
      getVideoId: {
        pathname: "/yt/resolve",
        paramName: "video_ids",
        paramArraySeperator: ",",
        responsePath: ["data", "videos", Values]
      }
    }
  },
  madiatorScrap: {
    name: "Madiator.com",
    hostname: "scrap.madiator.com",
    functions: {
      getChannelId: {
        pathname: "/api/get-lbry-channel",
        paramName: "url",
        paramArraySeperator: SingleValueAtATime,
        responsePath: ["lbrych"]
      },
      getVideoId: {
        pathname: "/api/get-lbry-video",
        paramName: "url",
        paramArraySeperator: SingleValueAtATime,
        responsePath: ["lbryurl"]
      }
    }
  }
}

export const getYtUrlResolversSettingsEntiries = () => {
  return Object.entries(ytUrlResolversSettings) as any as [Extract<keyof typeof ytUrlResolversSettings, string>, YTUrlResolver][]
}