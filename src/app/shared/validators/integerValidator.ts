import { AbstractControl, ValidationErrors, Validator, ValidatorFn } from '@angular/forms';
import { ValidationError } from '@angular/forms/signals';

export function integerValidator(): ValidatorFn {
  return (control : AbstractControl): ValidationErrors | null => {
    const value = control.value;

    return parseFloat(value) == parseInt(value) && !isNaN(value) ? null : {integer: true};
  }
}
