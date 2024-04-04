/* eslint-disable no-useless-constructor */
import { openDB, IDBPDatabase, deleteDB } from "idb";

type Database = IDBPDatabase<unknown>;
type IDBValidKey = string | number | Date | BufferSource | IDBValidKey[];

function isLessThanCurrentVersion(err: string) {
  // Chrome
  if (err.includes("is less than the existing version")) return true;
  // Safari
  if (err.includes("using a lower version than the existing version.")) return true;
  // Firefox
  if (err.includes("is a higher version than the version requested")) return true;
}

const _openDbStore = async (dbName: string, storeName: string, version: number) => {
  return await openDB(dbName, version, {
    upgrade: (database, oldVersion, newVersion, transaction) => {
      if (oldVersion === 0) {
        database.createObjectStore(storeName);
      }

      if (!database.objectStoreNames.contains(storeName)) {
        database.createObjectStore(storeName);
      }

      if (oldVersion < version) {
        const store = transaction.objectStore(storeName);
        store.clear();
      }
    },
  }).catch((err) => {
    // For development
    if (isLessThanCurrentVersion(String(err))) {
      deleteDB(dbName).then(() => {
        window.location.reload();
      });
    }

    return undefined;
  });
};

async function _getValue<T>(db: Database, storeName: string, key: IDBValidKey): Promise<T | undefined> {
  return await db.get(storeName, key);
}

async function _setValue<T>(db: Database, storeName: string, key: IDBValidKey, value: T): Promise<IDBValidKey> {
  return await db.put(storeName, value, key);
}

async function _removeValue(db: Database, storeName: string, key: IDBValidKey): Promise<void> {
  return await db.delete(storeName, key);
}

async function _getAllValues<T>(db: Database, storeName: string): Promise<(T | undefined)[]> {
  return await db.getAll(storeName);
}

export type DBCreateOptions = {
  dbName: string;
  storeName: string;
  version: number;
};

/**
 * Simple Key Value store
 * Defaults to `'auth-client-db'` with an object store of `'ic-keyval'`
 */
export class IdbKeyVal {
  /**
   *
   * @param {DBCreateOptions} options {@link DbCreateOptions}
   * @param {DBCreateOptions['dbName']} options.dbName name for the indexDB database
   * @default
   * @param {DBCreateOptions['storeName']} options.storeName name for the indexDB Data Store
   * @default
   * @param {DBCreateOptions['version']} options.version version of the database. Increment to safely upgrade
   * @constructs an {@link IdbKeyVal}
   */
  public static async create(options?: DBCreateOptions): Promise<IdbKeyVal> {
    const { dbName, storeName, version = 1 } = options ?? {};
    const db = await _openDbStore(dbName, storeName, version);
    return new IdbKeyVal(db, storeName);
  }

  // Do not use - instead prefer create
  private constructor(
    private _db: Database,
    private _storeName: string,
  ) {}

  /**
   * Basic setter
   * @param {IDBValidKey} key string | number | Date | BufferSource | IDBValidKey[]
   * @param value value to set
   * @returns void
   */
  public async set<T>(key: IDBValidKey, value: T) {
    return await _setValue<T>(this._db, this._storeName, key, value);
  }

  /**
   * Basic getter
   * Pass in a type T for type safety if you know the type the value will have if it is found
   * @param {IDBValidKey} key string | number | Date | BufferSource | IDBValidKey[]
   * @returns `Promise<T | null>`
   * @example
   * await get<string>('exampleKey') -> 'exampleValue'
   */
  public async get<T>(key: IDBValidKey): Promise<T | null> {
    return (await _getValue<T>(this._db, this._storeName, key)) ?? null;
  }

  /**
   * Remove a key
   * @param key {@link IDBValidKey}
   * @returns void
   */
  public async remove(key: IDBValidKey) {
    return await _removeValue(this._db, this._storeName, key);
  }

  /**
   * Get all values
   * @param key {@link IDBValidKey}
   * @returns void
   */
  public async getAll<T>(): Promise<(T | undefined)[] | null> {
    return await _getAllValues(this._db, this._storeName);
  }
}
