import {
  ChangeDetectionStrategy,
  ChangeDetectorRef,
  Component,
  inject,
  OnInit,
} from '@angular/core';
import { GeoService } from '../../core/services/geo.service';
import { Country } from '../../core/models/country.model';
import { MatPaginator, PageEvent } from '@angular/material/paginator';
import { FormsModule } from '@angular/forms';
import { MatOption } from '@angular/material/core';
import { MatFormField, MatInput } from '@angular/material/input';
import { MatSelect } from '@angular/material/select';
import { MatIcon } from '@angular/material/icon';
import { MatProgressSpinner } from '@angular/material/progress-spinner';
import { MatCell, MatCellDef, MatColumnDef, MatHeaderCell,
  MatHeaderCellDef, MatHeaderRow, MatHeaderRowDef, MatRow, MatRowDef, MatTable } from '@angular/material/table';
import { DecimalPipe } from '@angular/common';
import { City } from '../../core/models/city.model';
import { MatIconButton } from '@angular/material/button';

@Component({
  selector: 'app-cities',
  imports: [
    FormsModule,
    MatOption,
    MatFormField,
    MatSelect,
    MatIcon,
    MatProgressSpinner,
    MatCell,
    MatCellDef,
    MatColumnDef,
    MatHeaderCell,
    MatHeaderRow,
    MatHeaderRowDef,
    MatRow,
    MatRowDef,
    MatTable,
    DecimalPipe,
    MatHeaderCellDef,
    MatPaginator,
    MatInput,
    MatIconButton,
  ],
  templateUrl: './cities.html',
  styleUrl: './cities.css',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class Cities implements OnInit {
  private geoService = inject(GeoService);
  private cdr = inject(ChangeDetectorRef);

  cities: City[] = [];
  countries: Country[] = [];
  totalCount = 0;
  isLoading = false;

  selectedCountry = '';
  searchName = '';

  pageSize = 10;
  pageIndex = 0;
  columnsToDisplay = ['country', 'name', 'region', 'population', 'actions'];

  ngOnInit() {
    this.loadCountries();
    this.loadCities();
  }

  loadCountries(): void {
    this.geoService.getCountries(10, 0).subscribe({
      next: (response) => {
        this.countries = response.data;
        this.cdr.markForCheck();
      },
    });
  }

  loadCities(): void {
    this.isLoading = true;
    const offset = this.pageIndex * this.pageSize;

    this.geoService
      .getCities(
        this.pageSize,
        offset,
        this.selectedCountry || undefined,
        this.searchName || undefined,
      )
      .subscribe({
        next: (response) => {
          this.cities = response.data;
          this.totalCount = response.metadata.totalCount;
          this.isLoading = false;
          this.cdr.markForCheck();
        },
        error: () => {
          this.isLoading = false;
          this.cdr.markForCheck();
        },
      });
  }

  onCountryChange(): void {
    this.pageIndex = 0;
    this.loadCities();
  }

  onSearchChanged(): void {
    this.pageIndex = 0;
    this.loadCities();
  }

  onPageChange(event: PageEvent) {
    this.pageIndex = event.pageIndex;
    this.pageSize = event.pageSize;
    this.loadCities();
  }

  onEdit(city: City): void {
    //
  }

  onView(city: City): void {
    //
  }
}
