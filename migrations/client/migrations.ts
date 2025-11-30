import journal from './meta/_journal.json';
// @ts-expect-error - SQL files are imported as strings by Metro bundler
import m0000 from './0000_initial_client.sql';

interface MigrationConfig {
  journal: {
    entries: {
      idx: number;
      when: number;
      tag: string;
      breakpoints: boolean;
    }[];
  };
  migrations: Record<string, string>;
}

const migrations: MigrationConfig = {
  journal: {
    entries: journal.entries,
  },
  migrations: {
    m0000: m0000 as string,
  },
};

export default migrations;


