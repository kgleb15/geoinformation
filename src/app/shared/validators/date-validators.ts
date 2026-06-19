import { AbstractControl, ValidationErrors, ValidatorFn } from '@angular/forms';

export function dateNotAfterTodayValidator(): ValidatorFn {
  return (control: AbstractControl): ValidationErrors | null => {
    const value = control.value;

    let today: Date = new Date();

    return new Date(value) < today ? null : { dateAfterToday: true };
  };
}
