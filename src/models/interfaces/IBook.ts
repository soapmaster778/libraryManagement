import type { BookStatus, EntityId, Identifiable } from '../../types';

export interface IBook extends Identifiable {
  title: string;
  author: string;
  year: number;
  status: BookStatus;
  borrowedBy: EntityId | null;
}
