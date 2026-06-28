import { Component, OnInit, ChangeDetectionStrategy, ViewChild } from '@angular/core';
import { Country } from '../../core/models/country.model';
import { MatTableModule } from '@angular/material/table';
import { MatPaginatorModule } from '@angular/material/paginator';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatIcon } from '@angular/material/icon';
import { MatIconButton } from '@angular/material/button';
import { Header } from '../../shared/header/header';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { BaseTable } from '../../shared/base-table/base-table';
import { SearchInput } from '../../shared/search-input/search-input';
import { TranslatePipe } from '@ngx-translate/core';
import { MatSort, MatSortHeader } from '@angular/material/sort';

@Component({
  selector: 'app-countries',
  imports: [
    MatTableModule,
    MatPaginatorModule,
    MatProgressSpinnerModule,
    MatIcon,
    MatIconButton,
    Header,
    ReactiveFormsModule,
    FormsModule,
    SearchInput,
    TranslatePipe,
    MatSort,
    MatSortHeader,
  ],
  templateUrl: './countries.html',
  styleUrl: './countries.css',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class Countries extends BaseTable<Country> implements OnInit {
  columnsToDisplay = ['wikiDataId', 'action', 'name', 'code', 'currencyCodes'];

  @ViewChild(MatSort) sort!: MatSort;

  ngOnInit() {
    this.readFromUrl();
    this.load();
  }

  ngAfterViewInit() {
    this.restoreSort(this.sort);
  }

  protected fetchData(limit: number, offset: number, search?: string, sort?: string) {
    return this.geoService.getCountries(limit, offset, search, sort);
  }

  goToCities(countryCode: string): void {
    this.router.navigate(['/cities'], { queryParams: { country: countryCode } });
  }
}
