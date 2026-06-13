import { Component, inject } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { City } from '../../../core/models/city.model';
import { DecimalPipe } from '@angular/common';
import { MatButton } from '@angular/material/button';

@Component({
  selector: 'app-city-view-dialog',
  imports: [DecimalPipe, MatButton],
  templateUrl: './city-view-dialog.html',
  styleUrl: './city-view-dialog.css',
})
export class CityViewDialog {
  private dialogRef = inject(MatDialogRef<CityViewDialog>);
  data: City = inject(MAT_DIALOG_DATA);

  close(): void {
    this.dialogRef.close();
  }
}
