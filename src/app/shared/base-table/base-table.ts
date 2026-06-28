import { Component, inject, signal } from '@angular/core';
import { GeoService } from '../../core/services/geo.service';
import { forkJoin, Observable } from 'rxjs';
import { ApiResponseModel } from '../../core/models/api-response.model';
import { Sort } from '@angular/material/sort';
import { PageEvent } from '@angular/material/paginator';
import { ActivatedRoute, Router } from '@angular/router';

@Component({
  selector: 'app-base-table',
  template: '',
})
export abstract class BaseTable<T> {
  protected geoService = inject(GeoService);
  protected router = inject(Router);
  protected route = inject(ActivatedRoute);

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
  }

  onSearchChanged(): void {
    this.pageIndex.set(0);
    this.syncToUrl();
    this.load();
  }

  onPaginatorChanged(event: PageEvent): void {
    this.pageIndex.set(event.pageIndex);
    this.pageSize.set(event.pageSize);
    this.syncToUrl();
    this.load();
  }

  onSortChanged(sort: Sort): void {
    this.sortField.set(sort.direction ? this.mapSortField(sort.active) : '');
    this.sortDirection.set(sort.direction as 'asc' | 'desc' | '');
    this.pageIndex.set(0);
    this.syncToUrl();
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

  protected readFromUrl(extraParams?: (params:URLSearchParams) => void) {
    const params = this.route.snapshot.queryParamMap;

    const page = params.get('page');
    const pageSize = params.get('pageSize');
    const search = params.get('search');
    const sort = params.get('sort');
    const dir = params.get('dir');

    if (page) this.pageIndex.set(Number(page) - 1);
    if (pageSize) this.pageSize.set(Number(pageSize));
    if (search) this.searchName = search;
    if (sort) this.sortField.set(sort);
    if (dir) this.sortDirection.set(dir as 'asc' | 'desc' | '');
  }

  protected syncToUrl(extraParams: Record<string, string | null> = {}): void {
    this.router.navigate([], {
      relativeTo: this.route,
      queryParams: {
        page: this.pageIndex() > 0 ? this.pageIndex() + 1 : null,
        pageSize: this.pageSize() !== this.LIMIT ? this.pageSize() : null,
        search: this.searchName || null,
        sort: this.sortField() || null,
        dir: this.sortDirection() || null,
        ...extraParams,
      },
      queryParamsHandling: 'merge',
    });
  }
}
