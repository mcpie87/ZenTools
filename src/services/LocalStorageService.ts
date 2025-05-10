import { LocalStorageData } from "@/types/localStorageTypes";

export const STORAGE_KEY = "zen_tools";

// Usage:
// const storageService = new LocalStorageService("resonators");
// const resonators = storageService.load();
// resonators["name"] = { ... };
// storageService.save(resonators);
class LocalStorageService {
  private key: string;

  constructor(key: string, prefix: string = STORAGE_KEY) {
    this.key = `${prefix}_${key}`;
  }

  private isBrowser(): boolean {
    return typeof window !== 'undefined' && typeof window.localStorage !== 'undefined';
  }

  private loadRaw(): LocalStorageData | null {
    if (!this.isBrowser()) {
      return null;
    }
    const rawData = localStorage.getItem(this.key);
    if (!rawData) {
      return null;
    }

    try {
      return JSON.parse(rawData);
    } catch {
      return rawData;
    }
  }

  load(): LocalStorageData | null {
    return this.loadRaw();
  }

  save(data: LocalStorageData) {
    if (!this.isBrowser()) {
      return;
    }
    localStorage.setItem(this.key, JSON.stringify(data));
  }

  clear() {
    if (!this.isBrowser()) {
      return;
    }
    localStorage.removeItem(this.key);
  }
}

export default LocalStorageService