import { AbstractControl, ValidationErrors, ValidatorFn } from '@angular/forms';

export function integerValidator(): ValidatorFn {
  return (control : AbstractControl): ValidationErrors | null => {
    const value = control.value;

    return parseFloat(value) == parseInt(value) && !isNaN(value) ? null : {integer: true};
  }
}
