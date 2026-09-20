import type { EntityId, Identifiable } from '../../types';

export interface IUser extends Identifiable {
  name: string;
  borrowedBookIds: EntityId[];
}
