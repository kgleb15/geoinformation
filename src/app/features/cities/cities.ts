import {
  ChangeDetectionStrategy,
  Component,
  inject,
  OnInit,
} from '@angular/core';
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
import { BaseTable } from '../../shared/base-table/base-table';

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
export class Cities extends BaseTable<City> implements OnInit {
  countries: Country[] = [];
  selectedCountry = '';
  columnsToDisplay = ['country', 'name', 'region', 'population', 'actions'];

  private route = inject(ActivatedRoute);
  private dialog = inject(MatDialog);

  ngOnInit() {
    const countryFromUrl = this.route.snapshot.queryParamMap.get('countryCode');
    if (countryFromUrl) {
      this.selectedCountry = countryFromUrl;
    }
    this.loadAllCountries();
    this.load();
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

          if (response.data.length === countriesPageSize) {
            // Если еще остались страны для загрузки
            currentPage++;
            loadNextPage();
          } else {
            this.countries = allCountries;
            this.cdr.markForCheck();
          }
        },
        error: () => {
          this.cdr.markForCheck();
        },
      });
    };
    loadNextPage();
  }

  protected fetchData(limit: number, offset: number, search?: string) {
    return this.geoService.getCities(limit, offset, this.selectedCountry || undefined,  search);
  }

  onCountryChange(): void {
    this.pageIndex = 0;
    this.load();
  }

  onEdit(city: City): void {
    this.dialog.open(CityEditDialog, { data: city });
  }

  onView(city: City): void {
    this.dialog.open(CityViewDialog, { data: city });
  }
}
