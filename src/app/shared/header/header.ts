import { Component, inject } from '@angular/core';
import { RouterLink, RouterLinkActive } from '@angular/router';
import { MatRadioButton, MatRadioGroup } from '@angular/material/radio';
import { FormsModule } from '@angular/forms';
import { TranslatePipe, TranslateService } from '@ngx-translate/core';

@Component({
  selector: 'app-header',
  imports: [
    RouterLink,
    RouterLinkActive,
    MatRadioGroup,
    FormsModule,
    MatRadioButton,
    TranslatePipe,
  ],
  templateUrl: './header.html',
  styleUrl: './header.css',
})
export class Header {
  private translate = inject(TranslateService);

  selectedLang = this.translate.currentLang() ?? 'ru';

  onLangChange(lang: string): void {
    this.translate.use(lang);
  }
}
