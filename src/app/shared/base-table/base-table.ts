import { Component, inject, signal } from '@angular/core';
import { GeoService } from '../../core/services/geo.service';
import { forkJoin, Observable } from 'rxjs';
import { ApiResponseModel } from '../../core/models/api-response.model';
import { Sort } from '@angular/material/sort';
import { PageEvent } from '@angular/material/paginator';

@Component({
  selector: 'app-base-table',
  template: '',
})
export abstract class BaseTable<T> {
  protected geoService = inject(GeoService);

  items = signal<T[]>([]);
  totalCount = signal(0);
  isLoading = signal(false);

  private readonly LIMIT = 10;
  pageSize = signal(this.LIMIT);
  pageIndex = signal(0);
  searchName = '';

  sortField = signal<string>('');
  sortDirection = signal<'asc' | 'desc' | ''>('');

  abstract ngOnInit(): void;
  protected abstract fetchData(limit: number, offset: number, search?: string, sort?: string): Observable<ApiResponseModel<T>>;

  load(): void {
    this.isLoading.set(true);
    const baseOffset = this.pageIndex() * this.pageSize();
    const sort = this.buildSortParam() || undefined;
    const search = this.searchName || undefined;

    if (this.pageSize() <= this.LIMIT) {
      this.fetchData(this.pageSize(), baseOffset, search, sort).subscribe({
        next: (response) => {
          this.items.set(response.data);
          this.totalCount.set(response.metadata.totalCount);
          this.isLoading.set(false);
        },
        error: () => {
          this.isLoading.set(false);
        },
      });
    } else {
      this.loadMerged(baseOffset, search, sort);
    }
  }

  private loadMerged(baseOffset: number, search?: string, sort?: string) {
    const requests: Observable<ApiResponseModel<T>>[] = [];
    for (let offset = baseOffset; offset < baseOffset + this.pageSize(); offset += this.LIMIT) {
      requests.push(this.fetchData(this.LIMIT, offset, search, sort));
    }

    forkJoin(requests).subscribe({
      next: (responses) => {
        const merged = responses.flatMap((r) => r.data);
        this.items.set(merged);
        this.totalCount.set(responses[0].metadata.totalCount);
        this.isLoading.set(false);
      },
      error: () => {
        this.isLoading.set(false);
      },
    });
  }

  onSearchChanged(): void {
    this.pageIndex.set(0);
    this.load();
  }

  onPaginatorChanged(event: PageEvent): void {
    this.pageIndex.set(event.pageIndex);
    this.pageSize.set(event.pageSize);
    this.load();
  }

  onSortChanged(sort: Sort): void {
    this.sortField.set(sort.direction ? this.mapSortField(sort.active) : '');
    this.sortDirection.set(sort.direction as 'asc' | 'desc' | '');
    this.pageIndex.set(0);
    this.load();
  }

  protected mapSortField(column: string): string {
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
