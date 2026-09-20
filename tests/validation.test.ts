import { expect } from 'chai';
import { Validation } from '../src/utils/validators';

describe('Validation', () => {
  it('requires non-empty values', () => {
    const result = Validation.required('   ', 'Назва');

    expect(result.valid).to.equal(false);
    expect(result.errors[0]).to.include('Назва');
  });

  it('accepts numeric user ids', () => {
    expect(Validation.userId('1024').valid).to.equal(true);
  });

  it('rejects user ids with letters', () => {
    const result = Validation.userId('user-1');

    expect(result.valid).to.equal(false);
    expect(result.errors[0]).to.include('тільки цифри');
  });

  it('accepts a valid publication year', () => {
    expect(Validation.publicationYear('2024').valid).to.equal(true);
  });

  it('rejects invalid publication years', () => {
    expect(Validation.publicationYear('99').valid).to.equal(false);
    expect(Validation.publicationYear('3020').valid).to.equal(false);
  });
});
