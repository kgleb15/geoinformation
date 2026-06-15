import {
  ChangeDetectionStrategy,
  ChangeDetectorRef,
  Component,
  inject,
  OnInit,
} from '@angular/core';
import { GeoService } from '../../core/services/geo.service';
import { Country } from '../../core/models/country.model';
import { FormsModule } from '@angular/forms';
import { MatOption } from '@angular/material/core';
import { MatFormField, MatInput, MatPrefix } from '@angular/material/input';
import { MatSelect } from '@angular/material/select';
import { MatIcon } from '@angular/material/icon';
import { MatProgressSpinner } from '@angular/material/progress-spinner';
import { MatCell, MatCellDef, MatColumnDef, MatHeaderCell,
  MatHeaderCellDef, MatHeaderRow, MatHeaderRowDef, MatRow, MatRowDef, MatTable } from '@angular/material/table';
import { DecimalPipe } from '@angular/common';
import { City } from '../../core/models/city.model';
import { MatIconButton } from '@angular/material/button';
import { ActivatedRoute } from '@angular/router';
import { Paginator } from '../../shared/paginator/paginator';
import { Header } from '../../shared/header/header';
import { MatDialog } from '@angular/material/dialog';
import { CityViewDialog } from './city-view-dialog/city-view-dialog';
import { CityEditDialog } from './city-edit-dialog/city-edit-dialog';

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
    MatInput,
    MatIconButton,
    Paginator,
    Header,
    MatPrefix,
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

  private route = inject(ActivatedRoute);
  private dialog = inject(MatDialog);

  ngOnInit() {
    const countryFromUrl = this.route.snapshot.queryParamMap.get('countryCode');
    if (countryFromUrl) {
      this.selectedCountry = countryFromUrl;
    }
    this.loadAllCountries();
    this.loadCities();
  }

  loadAllCountries(): void {
    const countriesPageSize = 10;
    let currentPage = 0;
    let allCountries: Country[] = [];

    const loadNextPage = () => {
      const offset = currentPage * countriesPageSize;
      this.geoService.getCountries(countriesPageSize, offset).subscribe({
        next: (response) => {
          allCountries = [...allCountries, ...response.data];

          if(response.data.length === countriesPageSize) { // Если еще остались страны для загрузки
            currentPage++;
            loadNextPage();
          } else {
            this.countries = allCountries;
            this.cdr.markForCheck();
            console.log(`Загружено ${this.countries.length} стран`);
          }
        }, error: () => {
          this.cdr.markForCheck();
        },
      });
    };
    loadNextPage();
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

  onPageChange(page: number) {
    this.pageIndex = page;
    this.loadCities();
  }

  onEdit(city: City): void {
    this.dialog.open(CityEditDialog, { data: city });
  }

  onView(city: City): void {
    this.dialog.open(CityViewDialog, { data: city });
  }
}
