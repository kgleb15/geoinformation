import { ChangeDetectorRef, Component, Directive, inject, signal } from '@angular/core';
import { GeoService } from '../../core/services/geo.service';
import { Observable } from 'rxjs';
import { ApiResponseModel } from '../../core/models/api-response.model';

@Component({
  selector: 'app-base-table',
  template: '',
})
export abstract class BaseTable<T> {
  protected geoService = inject(GeoService);

  items = signal<T[]>([]);
  totalCount = signal(0);
  isLoading = signal(false);

  pageSize = 10;
  pageIndex = 0;
  searchName = '';

  abstract ngOnInit(): void;
  protected abstract fetchData(limit: number, offset: number, search?: string): Observable<ApiResponseModel<T>>;

  load(): void {
    this.isLoading.set(true);
    const offset = this.pageIndex * this.pageSize;

      this.fetchData(this.pageSize, offset, this.searchName || undefined).subscribe({
        next: (response) => {
          this.items.set(response.data);
          this.totalCount.set(response.metadata.totalCount);
          this.isLoading.set(false);
        },
        error: () => {
          this.isLoading.set(false);
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
