import type { EntityId, Identifiable } from '../types';

export class Library<T extends Identifiable> {
  private items: T[];

  public constructor(initialItems: T[] = []) {
    this.items = [...initialItems];
  }

  public add(item: T): void {
    if (this.findById(item.id)) {
      throw new Error(`Item with id ${item.id} already exists.`);
    }

    this.items = [...this.items, item];
  }

  public remove(id: EntityId): boolean {
    const initialLength = this.items.length;
    this.items = this.items.filter((item) => item.id !== id);

    return this.items.length !== initialLength;
  }

  public findById(id: EntityId): T | undefined {
    return this.items.find((item) => item.id === id);
  }

  public find(predicate: (item: T) => boolean): T[] {
    return this.items.filter(predicate);
  }

  public update(id: EntityId, updater: (item: T) => void): T {
    const item = this.findById(id);

    if (!item) {
      throw new Error(`Item with id ${id} was not found.`);
    }

    updater(item);
    return item;
  }

  public getAll(): T[] {
    return [...this.items];
  }

  public replace(items: T[]): void {
    this.items = [...items];
  }
}
