import { Component, inject } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { City } from '../../../core/models/city.model';
import { DecimalPipe } from '@angular/common';
import { MatButton, MatIconButton } from '@angular/material/button';
import { MatFormField, MatInput, MatLabel, MatSuffix } from '@angular/material/input';
import { FormBuilder, FormGroup, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
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
  ],
  templateUrl: './city-edit-dialog.html',
  styleUrl: './city-edit-dialog.css',
})
export class CityEditDialog {
  private dialogRef = inject(MatDialogRef<CityEditDialog>);
  data: City = inject(MAT_DIALOG_DATA);
  private fb = inject(FormBuilder);

  form: FormGroup = this.fb.group({
    region: [this.data.region],
    population: [this.data.population],
    foundingDate: [null],
    longitude: [this.data.longitude],
    latitude: [this.data.latitude],
  });

  cancel(): void {
    this.dialogRef.close();
  }

  save(): void {
    //
  }
}
