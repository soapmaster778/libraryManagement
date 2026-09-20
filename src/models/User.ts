import type { EntityId } from '../types';
import type { IUser } from './interfaces/IUser';

export class User implements IUser {
  public constructor(
    public readonly id: EntityId,
    private fullName: string,
    public borrowedBookIds: EntityId[] = [],
  ) {}

  public get name(): string {
    return this.fullName;
  }

  public set name(value: string) {
    this.fullName = value;
  }

  public borrowBook(bookId: EntityId): void {
    if (!this.borrowedBookIds.includes(bookId)) {
      this.borrowedBookIds = [...this.borrowedBookIds, bookId];
    }
  }

  public returnBook(bookId: EntityId): void {
    this.borrowedBookIds = this.borrowedBookIds.filter((id) => id !== bookId);
  }

  public toJSON(): IUser {
    return {
      id: this.id,
      name: this.name,
      borrowedBookIds: this.borrowedBookIds,
    };
  }

  public static from(data: IUser): User {
    return new User(data.id, data.name, data.borrowedBookIds);
  }
}
