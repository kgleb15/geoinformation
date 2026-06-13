import { Component } from '@angular/core';
import { RouterLink, RouterLinkActive } from '@angular/router';
import { MatRadioButton, MatRadioGroup } from '@angular/material/radio';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-header',
  imports: [RouterLink, RouterLinkActive, MatRadioGroup, FormsModule, MatRadioButton],
  templateUrl: './header.html',
  styleUrl: './header.css',
})
export class Header {
  selectedLang = 'ru';
}
