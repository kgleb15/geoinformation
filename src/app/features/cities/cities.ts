import { ChangeDetectionStrategy, Component, inject, OnInit, signal, ViewChild } from '@angular/core';
import { Country } from '../../core/models/country.model';
import { FormsModule } from '@angular/forms';
import { MatOption } from '@angular/material/core';
import { MatFormField } from '@angular/material/input';
import { MatSelect } from '@angular/material/select';
import { MatIcon } from '@angular/material/icon';
import { MatProgressSpinner } from '@angular/material/progress-spinner';
import { MatCell, MatCellDef, MatColumnDef, MatHeaderCell,
  MatHeaderCellDef, MatHeaderRow, MatHeaderRowDef, MatRow, MatRowDef, MatTable } from '@angular/material/table';
import { DecimalPipe, NgIf } from '@angular/common';
import { City } from '../../core/models/city.model';
import { MatIconButton } from '@angular/material/button';
import { ActivatedRoute } from '@angular/router';
import { Paginator } from '../../shared/paginator/paginator';
import { Header } from '../../shared/header/header';
import { MatDialog } from '@angular/material/dialog';
import { CityViewDialog } from './city-view-dialog/city-view-dialog';
import { CityEditDialog } from './city-edit-dialog/city-edit-dialog';
import { BaseTable } from '../../shared/base-table/base-table';
import { SearchInput } from '../../shared/search-input/search-input';
import { CdkFixedSizeVirtualScroll, CdkVirtualForOf, CdkVirtualScrollViewport } from '@angular/cdk/scrolling';
import { TranslatePipe } from '@ngx-translate/core';
import { map } from 'rxjs';

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
    MatIconButton,
    Paginator,
    Header,
    SearchInput,
    CdkVirtualScrollViewport,
    CdkFixedSizeVirtualScroll,
    CdkVirtualForOf,
    TranslatePipe,
  ],
  templateUrl: './cities.html',
  styleUrl: './cities.css',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class Cities extends BaseTable<City> implements OnInit {
  selectedCountry = '';
  columnsToDisplay = ['country', 'name', 'region', 'population', 'actions'];

  countries = signal<Country[]>([]);
  countriesTotalCount = signal(0);
  isLoadingCountries = signal(false);

  countriesPageIndex = 0;
  countriesPageSize = 10;

  private route = inject(ActivatedRoute);
  private dialog = inject(MatDialog);

  ngOnInit() {
    const countryFromUrl = this.route.snapshot.queryParamMap.get('countryCode');
    if (countryFromUrl) {
      this.selectedCountry = countryFromUrl;
    }
    this.loadCountries();
    this.load();
  }

  loadCountries(): void {
    if (this.isLoadingCountries()) {
      return;
    }

    this.isLoadingCountries.set(true);
    const offset = this.countriesPageSize * this.countriesPageIndex;

    this.geoService.getCountries(this.countriesPageSize, offset).subscribe({
      next: (response) => {
        if (this.countriesPageIndex === 0) {
          this.countries.set(response.data);
        } else {
          this.countries.update((prev) => [...prev, ...response.data]);
        }
        this.countriesTotalCount.set(response.metadata.totalCount || this.countries().length);
        this.isLoadingCountries.set(false);
      },
      error: () => {
        this.isLoadingCountries.set(false);
      },
    });
  }

  loadMoreCountries(): void {
    if (this.countries().length < this.countriesTotalCount()) {
      this.countriesPageIndex++;
      this.loadCountries();
    }
  }

  protected fetchData(limit: number, offset: number, search?: string) {
    return this.geoService.getCities(limit, offset, this.selectedCountry || undefined, search).pipe(
      map((response) => {
        const mergedData = response.data.map(city => {
          const saved = localStorage.getItem(`edited_city_${city.id}`);
          return saved ? (JSON.parse(saved) as City) : city;
        });
        return {...response, data: mergedData};
      })
    );
  }

  onCountryChange(): void {
    this.pageIndex = 0;
    this.load();
  }

  onEdit(city: City): void {
    const dialogRef = this.dialog.open(CityEditDialog, {data: city});

    dialogRef.afterClosed().subscribe((updatedCity:City | undefined) => {
      if(updatedCity) {
        this.items.update((current) =>
          current.map((item) => (item.id === updatedCity.id ? updatedCity : item))
        );
      }
    });
  }

  onView(city: City): void {
    this.dialog.open(CityViewDialog, { data: city });
  }

  @ViewChild(CdkVirtualScrollViewport, { static: false })
  cdkVirtualScrollViewPort!: CdkVirtualScrollViewport;

  onSelectOpenedChange(isOpened: boolean): void {
    if (isOpened && this.cdkVirtualScrollViewPort) {
      setTimeout(() => {
        this.cdkVirtualScrollViewPort.checkViewportSize();
      });
    }
  }

  onScrollIndexChange(index: number): void {
    if (
      index >= this.countries().length - 5 &&
      this.countries().length < this.countriesTotalCount() &&
      !this.isLoadingCountries()
    ) {
      this.loadMoreCountries();
    }
  }

  trackCountry(index: number, country: Country): string {
    return country.code;
  }
}
