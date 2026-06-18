import { Component, model, output } from '@angular/core';
import { MatFormField, MatInput, MatPrefix } from '@angular/material/input';
import { MatIcon } from '@angular/material/icon';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { debounceTime, distinctUntilChanged, Subject, takeUntil } from 'rxjs';

@Component({
  selector: 'app-search-input',
  imports: [MatFormField, MatIcon, MatInput, MatPrefix, ReactiveFormsModule, FormsModule],
  templateUrl: './search-input.html',
  styleUrl: './search-input.css',
})
export class SearchInput {
  value = model<string>('');
  placeholder: string = 'Поиск';
  searchChange = output<void>();

  private searchSubject = new Subject<string>();
  private destroy$ = new Subject();

  ngOnInit() {
    this.searchSubject
      .pipe(debounceTime(300), distinctUntilChanged(), takeUntil(this.destroy$))
      .subscribe((search) => {
        this.searchChange.emit();
      });
  }

  onChange(): void {
    this.searchSubject.next(this.value());
  }

  ngOnDestroy() {
    this.destroy$.complete();
  }
}
