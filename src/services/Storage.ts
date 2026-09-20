export class StorageService<T> {
  public constructor(private readonly key: string) {}

  public save(items: T[]): void {
    localStorage.setItem(this.key, JSON.stringify(items));
  }

  public load(): T[] {
    const value = localStorage.getItem(this.key);

    if (!value) {
      return [];
    }

    try {
      return JSON.parse(value) as T[];
    } catch {
      this.clear();
      return [];
    }
  }

  public remove(): void {
    localStorage.removeItem(this.key);
  }

  public clear(): void {
    localStorage.removeItem(this.key);
  }
}
