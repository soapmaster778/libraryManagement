export type EntityId = string;

export interface Identifiable {
  id: EntityId;
}

export enum BookStatus {
  Available = 'available',
  Borrowed = 'borrowed',
}
