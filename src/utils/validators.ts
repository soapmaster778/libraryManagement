export interface ValidationResult {
  valid: boolean;
  errors: string[];
}

export namespace Validation {
  const yearPattern = /^(1[5-9]\d{2}|20\d{2})$/;
  const numericPattern = /^\d+$/;

  export const required = (value: string, fieldName = 'Поле'): ValidationResult => {
    const valid = value.trim().length > 0;
    return {
      valid,
      errors: valid ? [] : [`${fieldName} обов'язкове для заповнення.`],
    };
  };

  export const userId = (value: string): ValidationResult => {
    const requiredResult = required(value, 'ID користувача');

    if (!requiredResult.valid) {
      return requiredResult;
    }

    const valid = numericPattern.test(value);
    return {
      valid,
      errors: valid ? [] : ['ID користувача має містити тільки цифри.'],
    };
  };

  export const publicationYear = (value: string): ValidationResult => {
    const requiredResult = required(value, 'Рік видання');

    if (!requiredResult.valid) {
      return requiredResult;
    }

    const valid = yearPattern.test(value) && Number(value) <= new Date().getFullYear();
    return {
      valid,
      errors: valid ? [] : ['Рік видання має бути коректним роком від 1500 до поточного року.'],
    };
  };

  export const combine = (...results: ValidationResult[]): ValidationResult => {
    const errors = results.flatMap((result) => result.errors);
    return {
      valid: errors.length === 0,
      errors,
    };
  };
}
