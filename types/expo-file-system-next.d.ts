declare module 'expo-file-system/next' {
  interface DirectoryCreateOptions {
    intermediates?: boolean;
    overwrite?: boolean;
    idempotent?: boolean;
  }

  interface FileCreateOptions {
    intermediates?: boolean;
    overwrite?: boolean;
  }

  interface DirectoryInfo {
    exists: boolean;
    size?: number | null;
  }

  interface FileInfo extends DirectoryInfo {
    size?: number;
    md5?: string | null;
  }

  export class Directory {
    constructor(...uris: Array<string | Directory | File>);
    readonly uri: string;
    readonly exists: boolean;
    create(options?: DirectoryCreateOptions): void;
    delete(): void;
    info(): DirectoryInfo;
  }

  export class File {
    constructor(...uris: Array<string | Directory | File>);
    readonly uri: string;
    size: number;
    readonly exists: boolean;
    create(options?: FileCreateOptions): void;
    delete(): void;
    info(): FileInfo;
    static downloadFileAsync(
      url: string,
      destination: Directory | File,
      options?: { idempotent?: boolean }
    ): Promise<File>;
  }

  export class Paths {
    static get cache(): Directory;
    static get document(): Directory;
  }
}
