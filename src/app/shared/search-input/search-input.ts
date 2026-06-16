import { Component, model, output } from '@angular/core';
import { MatFormField, MatInput, MatPrefix } from '@angular/material/input';
import { MatIcon } from '@angular/material/icon';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';

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

  onChange(): void {
    this.searchChange.emit();
  }
}
