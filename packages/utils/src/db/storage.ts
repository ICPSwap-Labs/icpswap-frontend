import { IdbKeyVal } from "./db";

export const isBrowser = typeof window !== "undefined";

export type StoredKey = string | CryptoKeyPair;

/**
 * Interface for persisting user authentication data
 */
export interface ClientStorage {
  get(key: string): Promise<StoredKey | null>;

  set(key: string, value: StoredKey): Promise<void>;

  remove(key: string): Promise<void>;
}

/**
 * IdbStorage is an interface for simple storage of string key-value pairs built on {@link IdbKeyVal}
 *
 * It replaces {@link LocalStorage}
 * @see implements {@link AuthClientStorage}
 */
export class IdbStorage implements ClientStorage {
  // Initializes a KeyVal on first request
  private initializedDb: IdbKeyVal | undefined;

  private version = 1;

  private dbName: string;

  private storeName: string;

  constructor(dbName: string, DB_VERSION = 1, storeName: string) {
    this.version = DB_VERSION;
    this.dbName = dbName;
    this.storeName = storeName;
  }

  get _db(): Promise<IdbKeyVal> {
    return new Promise((resolve) => {
      if (this.initializedDb) {
        resolve(this.initializedDb);
        return;
      }

      IdbKeyVal.create({
        version: this.version,
        storeName: this.storeName,
        dbName: this.dbName,
      }).then((db) => {
        this.initializedDb = db;
        resolve(db);
      });
    });
  }

  public async get(key: string): Promise<string | null> {
    const db = await this._db;
    return await db.get<string>(key);
  }

  public async set(key: string, value: string): Promise<void> {
    const db = await this._db;
    await db.set(key, value);
  }

  public async remove(key: string): Promise<void> {
    const db = await this._db;
    await db.remove(key);
  }

  public async getAll(): Promise<(string | undefined)[] | null> {
    const db = await this._db;
    return await db.getAll<string>();
  }
}
