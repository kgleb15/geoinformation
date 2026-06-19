import { ChangeDetectorRef, Component, Directive, inject } from '@angular/core';
import { GeoService } from '../../core/services/geo.service';
import { Observable } from 'rxjs';
import { ApiResponseModel } from '../../core/models/api-response.model';

@Component({
  selector: 'app-base-table',
  template: '',
})
export abstract class BaseTable<T> {
  protected geoService = inject(GeoService);
  protected cdr = inject(ChangeDetectorRef);

  items: T[] = [];
  totalCount = 0;
  isLoading = false;

  pageSize = 10;
  pageIndex = 0;
  searchName = '';

  abstract ngOnInit(): void;
  protected abstract fetchData(limit: number, offset: number, search?: string): Observable<ApiResponseModel<T>>;

  load(): void {
    this.isLoading = true;
    const offset = this.pageIndex * this.pageSize;

      this.fetchData(this.pageSize, offset, this.searchName || undefined).subscribe({
        next: (response) => {
          this.items = response.data;
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

  onSearchChanged(): void {
    this.pageIndex = 0;
    this.load();
  }

  onPageChange(page: number) {
    this.pageIndex = page;
    this.load();
  }
}
