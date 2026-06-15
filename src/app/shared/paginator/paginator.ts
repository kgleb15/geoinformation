import { Component, input, output, computed } from '@angular/core';
import { NgClass } from '@angular/common';
import { MatButton, MatIconButton } from '@angular/material/button';
import { MatIcon } from '@angular/material/icon';

@Component({
  selector: 'app-paginator',
  imports: [MatButton, MatIcon, MatIconButton],
  templateUrl: './paginator.html',
  styleUrl: './paginator.css',
})
export class Paginator {
  pageIndex = input.required<number>();
  pageSize = input.required<number>();
  totalCount = input.required<number>();

  pageChange = output<number>();

  totalPages = computed(() => Math.ceil(this.totalCount() / this.pageSize()));

  pages = computed(() => {
    const total = this.totalPages();
    const current = this.pageIndex();
    const result: (number | '...')[] = [];

    if (total <= 7) {
      return Array.from({ length: total }, (_, i) => i);
    }

    result.push(0);

    if (current > 3) {
      result.push('...');
    }

    const start = Math.max(1, current - 2);
    const end = Math.min(total - 2, current + 2);

    for (let i = start; i <= end; i++) {
      result.push(i);
    }
    if (current < total - 4) result.push('...');
    result.push(total - 1);

    return result;
  });

  goTo(page: number | '...') {
    if (page === '...' || page === this.pageIndex()) {
      return;
    }
    this.pageChange.emit(page);
  }

  isCurrentPage(page: number | '...'): boolean {
    return page !== '...' && page === this.pageIndex();
  }
}
