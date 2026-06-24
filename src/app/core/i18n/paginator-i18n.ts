import { effect, inject } from '@angular/core';
import { MatPaginatorIntl } from '@angular/material/paginator';
import { Subject } from 'rxjs';
import { TranslateService } from '@ngx-translate/core';

export class TranslatedPaginatorIntl implements MatPaginatorIntl {
  changes = new Subject<void>();
  private translate = inject(TranslateService);

  itemsPerPageLabel = '';
  nextPageLabel = '';
  previousPageLabel = '';
  firstPageLabel = '';
  lastPageLabel = '';

  constructor() {
    effect(() => {
      this.translate.currentLang();
      this.updateLabels();
      this.changes.next();
    });
  }

  private updateLabels() {
    this.itemsPerPageLabel = this.translate.instant('paginator.itemsPerPage');
    this.nextPageLabel = this.translate.instant('paginator.nextPage');
    this.previousPageLabel = this.translate.instant('paginator.previousPage');
    this.firstPageLabel = this.translate.instant('paginator.firstPage');
    this.lastPageLabel = this.translate.instant('paginator.lastPage');
  }

  getRangeLabel(page: number, pageSize: number, length: number): string {
    const of = this.translate.instant('paginator.of');
    if (length === 0 || pageSize === 0) {
      return `0 ${of} ${length}`;
    }
    const start = page * pageSize + 1;
    const end = Math.min(page * pageSize + pageSize, length);
    return `${start} - ${end} ${of} ${length}`;
  }
}
