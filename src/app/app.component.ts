import { Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { HeaderComponent } from './header/header.component';
import { MainComponent } from './main/main.component';

import { MatSnackBarModule } from '@angular/material/snack-bar';
@Component({
  selector: 'app-root',
  imports: [
    RouterOutlet,
    HeaderComponent,
    MainComponent,
    MatSnackBarModule
  ],
 
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css'],
})
export class AppComponent {
  title = 'minhTNT';
  searchQuery: string = ''; 

  onSearch(query: string): void {
    this.searchQuery = query; 
    console.log('searchQuery',query)
  }
}
