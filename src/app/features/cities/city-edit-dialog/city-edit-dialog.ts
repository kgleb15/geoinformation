import { Component, inject } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { City } from '../../../core/models/city.model';
import { MatButton, MatIconButton } from '@angular/material/button';
import { integerValidator } from '../../../shared/validators/number-validators';
import { dateNotAfterTodayValidator } from '../../../shared/validators/date-validators';
import { MatError, MatFormField, MatInput, MatLabel, MatSuffix } from '@angular/material/input';
import {
  FormBuilder,
  FormGroup,
  FormsModule,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { MatIcon } from '@angular/material/icon';
import { MatDatepicker, MatDatepickerInput, MatDatepickerToggle } from '@angular/material/datepicker';
import { MatNativeDateModule } from '@angular/material/core';

@Component({
  selector: 'app-city-edit-dialog',
  imports: [
    MatButton,
    MatFormField,
    MatLabel,
    FormsModule,
    MatIcon,
    MatIconButton,
    MatInput,
    ReactiveFormsModule,
    MatDatepickerInput,
    MatDatepickerToggle,
    MatDatepicker,
    MatNativeDateModule,
    MatSuffix,
    MatError,
  ],
  templateUrl: './city-edit-dialog.html',
  styleUrl: './city-edit-dialog.css',
})
export class CityEditDialog {
  private dialogRef = inject(MatDialogRef<CityEditDialog>);
  data: City = inject(MAT_DIALOG_DATA);
  private fb = inject(FormBuilder);

  form: FormGroup = this.fb.group({
    region: [this.data.region, [Validators.required]],
    population: [this.data.population, [Validators.required, Validators.min(1), integerValidator()]],
    foundingDate: [null, [dateNotAfterTodayValidator()]],
    longitude: [
      this.data.longitude,
      [Validators.required, Validators.min(-180), Validators.max(180)],
    ],
    latitude: [this.data.latitude, [Validators.required, Validators.min(-90), Validators.max(90)]],
  });

  cancel(): void {
    this.dialogRef.close();
  }

  save(): void {
    if (this.form.invalid) {
      this.form.markAllAsTouched();
      return;
    }
  }
}
