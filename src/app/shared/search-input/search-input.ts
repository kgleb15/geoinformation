import { Component, inject, model, OnDestroy, OnInit, output } from '@angular/core';
import { MatFormField, MatInput, MatPrefix } from '@angular/material/input';
import { MatIcon } from '@angular/material/icon';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { NgxControlValueAccessor } from 'ngxtension/control-value-accessor';
import { debounceTime, distinctUntilChanged, Subject, takeUntil } from 'rxjs';

@Component({
  selector: 'app-search-input',
  imports: [MatFormField, MatIcon, MatInput, MatPrefix, ReactiveFormsModule, FormsModule],
  hostDirectives: [
    {
      directive: NgxControlValueAccessor,
      inputs: ['value'],
      outputs: ['valueChange'],
    },
  ],
  templateUrl: './search-input.html',
  styleUrl: './search-input.css',
})
export class SearchInput {
  cva = inject<NgxControlValueAccessor<string>>(NgxControlValueAccessor);

  placeholder: string = 'Поиск';

  private searchSubject = new Subject<string>();
  private destroy$ = new Subject();

  ngOnInit() {
    this.searchSubject
      .pipe(debounceTime(300), distinctUntilChanged(), takeUntil(this.destroy$))
      .subscribe((search) => {
        this.cva.value = search;
      });
  }

  onChange(event: Event): void {
    this.searchSubject.next((event.target as HTMLInputElement).value);
  }

  ngOnDestroy() {
    this.destroy$.complete();
  }
}
