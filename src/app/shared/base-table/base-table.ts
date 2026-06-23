import { ChangeDetectorRef, Component, Directive, inject, signal } from '@angular/core';
import { GeoService } from '../../core/services/geo.service';
import { Observable } from 'rxjs';
import { ApiResponseModel } from '../../core/models/api-response.model';
import { Sort } from '@angular/material/sort';

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

  sortField = signal<string>('');
  sortDirection = signal<'asc' | 'desc' | ''>('');

  abstract ngOnInit(): void;
  protected abstract fetchData(limit: number, offset: number, search?: string, sort?: string): Observable<ApiResponseModel<T>>;

  load(): void {
    this.isLoading.set(true);
    const offset = this.pageIndex * this.pageSize;
    const sort = this.buildSortParam();

      this.fetchData(this.pageSize, offset, this.searchName || undefined, sort || undefined).subscribe({
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

  onSortChanged(sort : Sort): void {
    this.sortField.set(sort.direction ? this.mapSortField(sort.active) : '');
    this.sortDirection.set(sort.direction as 'asc' | 'desc' | '');
    this.pageIndex = 0;
    this.load();
  }

  protected mapSortField(column: string) : string {
    return column;
  }

  private buildSortParam(): string {
    const field = this.sortField();
    if (!field) {
      return '';
    }
    return this.sortDirection() === 'desc' ? `-${field}` : `+${field}`;
  }
}
