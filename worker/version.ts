export const DEFAULT_APP_VERSION = '2.22.5';

export const resolveAppVersion = (env?: { APP_VERSION?: string }): string => {
  return env?.APP_VERSION || DEFAULT_APP_VERSION;
};
