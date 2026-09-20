import type { EntityId } from '../types';
import { BookStatus } from '../types';
import type { IBook } from './interfaces/IBook';

export class Book implements IBook {
  public constructor(
    public readonly id: EntityId,
    private bookTitle: string,
    private bookAuthor: string,
    private publicationYear: number,
    public status: BookStatus = BookStatus.Available,
    public borrowedBy: EntityId | null = null,
  ) {}

  public get title(): string {
    return this.bookTitle;
  }

  public set title(value: string) {
    this.bookTitle = value;
  }

  public get author(): string {
    return this.bookAuthor;
  }

  public set author(value: string) {
    this.bookAuthor = value;
  }

  public get year(): number {
    return this.publicationYear;
  }

  public set year(value: number) {
    this.publicationYear = value;
  }

  public borrow(userId: EntityId): void {
    this.status = BookStatus.Borrowed;
    this.borrowedBy = userId;
  }

  public returnBook(): void {
    this.status = BookStatus.Available;
    this.borrowedBy = null;
  }

  public toJSON(): IBook {
    return {
      id: this.id,
      title: this.title,
      author: this.author,
      year: this.year,
      status: this.status,
      borrowedBy: this.borrowedBy,
    };
  }

  public static from(data: IBook): Book {
    return new Book(data.id, data.title, data.author, data.year, data.status, data.borrowedBy);
  }
}
