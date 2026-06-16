import { Component, inject, OnInit, ChangeDetectionStrategy, ChangeDetectorRef, } from '@angular/core';
import { Country } from '../../core/models/country.model';
import { MatTableModule } from '@angular/material/table';
import { MatPaginatorModule } from '@angular/material/paginator';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { Router } from '@angular/router';
import { MatIcon } from '@angular/material/icon';
import { MatIconButton } from '@angular/material/button';
import { Paginator } from '../../shared/paginator/paginator';
import { Header } from '../../shared/header/header';
import { MatFormField, MatInput, MatPrefix } from '@angular/material/input';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { BaseTable } from '../../shared/base-table/base-table';
import { SearchInput } from '../../shared/search-input/search-input';

@Component({
  selector: 'app-countries',
  imports: [
    MatTableModule,
    MatPaginatorModule,
    MatProgressSpinnerModule,
    MatIcon,
    MatIconButton,
    Paginator,
    Header,
    MatFormField,
    MatInput,
    ReactiveFormsModule,
    FormsModule,
    MatPrefix,
    SearchInput,
  ],
  templateUrl: './countries.html',
  styleUrl: './countries.css',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class Countries extends BaseTable<Country> implements OnInit {
  columnsToDisplay = ['wikiDataId', 'action', 'name', 'code', 'currencyCodes'];
  private router = inject(Router);

  ngOnInit() {
    this.load();
  }

  protected fetchData(limit: number, offset: number, search?: string) {
    return this.geoService.getCountries(limit, offset, search);
  }

  goToCities(countryCode: string): void {
    this.router.navigate(['/cities'], { queryParams: { countryCode } });
  }
}
