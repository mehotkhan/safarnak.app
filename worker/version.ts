export const DEFAULT_APP_VERSION = '2.21.10';

export const resolveAppVersion = (env?: { APP_VERSION?: string }): string => {
  return env?.APP_VERSION || DEFAULT_APP_VERSION;
};
