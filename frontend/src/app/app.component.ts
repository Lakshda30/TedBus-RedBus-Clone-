import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent implements OnInit {

  title = 'frontend';

  // ✅ DARK MODE TOGGLE
  toggleTheme() {
    document.body.classList.toggle('dark-mode');

    localStorage.setItem(
      'theme',
      document.body.classList.contains('dark-mode') ? 'dark' : 'light'
    );
  }

  // ✅ LOAD SAVED THEME
  ngOnInit() {
    const theme = localStorage.getItem('theme');

    if (theme === 'dark') {
      document.body.classList.add('dark-mode');
    }
  }

}

