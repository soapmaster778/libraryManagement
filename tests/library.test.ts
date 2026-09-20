import { expect } from 'chai';
import { Library } from '../src/services/Library';
import type { Identifiable } from '../src/types';

interface TestItem extends Identifiable {
  title: string;
}

describe('Library', () => {
  it('adds an item to the collection', () => {
    const library = new Library<TestItem>();

    library.add({ id: '1', title: 'Clean Code' });

    expect(library.getAll()).to.have.lengthOf(1);
    expect(library.findById('1')?.title).to.equal('Clean Code');
  });

  it('removes an item by id', () => {
    const library = new Library<TestItem>([
      { id: '1', title: 'Clean Code' },
      { id: '2', title: 'Refactoring' },
    ]);

    const removed = library.remove('1');

    expect(removed).to.equal(true);
    expect(library.findById('1')).to.equal(undefined);
    expect(library.getAll()).to.have.lengthOf(1);
  });

  it('finds items with a predicate', () => {
    const library = new Library<TestItem>([
      { id: '1', title: 'Clean Code' },
      { id: '2', title: 'Domain-Driven Design' },
    ]);

    const result = library.find((item) => item.title.includes('Design'));

    expect(result).to.deep.equal([{ id: '2', title: 'Domain-Driven Design' }]);
  });

  it('rejects duplicate ids', () => {
    const library = new Library<TestItem>([{ id: '1', title: 'First' }]);

    expect(() => library.add({ id: '1', title: 'Second' })).to.throw('already exists');
  });
});
