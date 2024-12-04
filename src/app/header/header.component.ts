import { Component, Output, EventEmitter  } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatToolbarModule } from '@angular/material/toolbar'; 
import { MatFormFieldModule } from '@angular/material/form-field';  
import { MatInputModule } from '@angular/material/input'; 
import { MatGridListModule } from '@angular/material/grid-list';
import { FormsModule } from '@angular/forms';  
@Component({
  selector: 'app-header',
  imports: [ MatToolbarModule,MatFormFieldModule,MatInputModule,MatGridListModule,CommonModule,FormsModule],
  templateUrl: './header.component.html',
  styleUrl: './header.component.css'
})
export class HeaderComponent {
  @Output() search = new EventEmitter<string>(); 
  searchTerm: string = '';
  path: string = '../../assets/logo.png';
  onSearch() {
    this.search.emit(this.searchTerm); 
  }
}
