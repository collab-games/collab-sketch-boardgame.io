import { FlatFile } from 'boardgame.io/server';
import { StorageCache } from 'bgio-storage-cache';

export function getDatabase() {
  const file = new FlatFile({
    dir: 'db',
    logging: false,
  });

  return new StorageCache(file, { cacheSize: 200 });
}