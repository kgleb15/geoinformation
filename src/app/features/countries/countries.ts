import { Component, inject, OnInit, ChangeDetectionStrategy, ChangeDetectorRef, } from '@angular/core';
import { Country } from '../../core/models/country.model';
import { GeoService } from '../../core/services/geo.service';
import { MatTableModule } from '@angular/material/table';
import { MatPaginatorModule } from '@angular/material/paginator';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatPaginator, PageEvent } from '@angular/material/paginator';
import { Router } from '@angular/router';
import { City } from '../../core/models/city.model';
import { MatIcon } from '@angular/material/icon';
import { MatIconButton } from '@angular/material/button';
import { Paginator } from '../../shared/paginator/paginator';

@Component({
  selector: 'app-countries',
  imports: [
    MatTableModule,
    MatPaginatorModule,
    MatProgressSpinnerModule,
    MatIcon,
    MatIconButton,
    Paginator,
  ],
  templateUrl: './countries.html',
  styleUrl: './countries.css',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class Countries implements OnInit {
  private geoService = inject(GeoService);

  countries: Country[] = [];
  totalCount = 0;
  isLoading = false;

  pageSize = 10;
  pageIndex = 0;
  columnsToDisplay = ['wikiDataId', 'action', 'name', 'code', 'currencyCodes'];

  private router = inject(Router);

  private cdr = inject(ChangeDetectorRef);

  ngOnInit() {
    this.loadCountries();
  }

  loadCountries(): void {
    this.isLoading = true;
    const offset = this.pageIndex * this.pageSize;

    this.geoService.getCountries(this.pageSize, offset).subscribe({
      next: (response) => {
        this.countries = response.data;
        this.totalCount = response.metadata.totalCount;
        this.isLoading = false;
        this.cdr.markForCheck();
      },
      error: (error) => {
        this.isLoading = false;
        this.cdr.markForCheck();
        //
      },
    });
  }

  onPageChange(page: number) {
    this.pageIndex = page;
    this.loadCountries();
  }

  goToCities(countryCode: string): void {
    this.router.navigate(['/cities'], { queryParams: { countryCode } });
  }
}
