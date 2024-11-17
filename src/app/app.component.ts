import { Component } from '@angular/core';
import { RouterModule, RouterOutlet } from '@angular/router';
import { NavbarComponent } from "./components/UI/navbar/navbar.component";

import { AsyncPipe, CommonModule } from '@angular/common';
import { DateFormatPipe } from './Pipes/date-format.pipe';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [RouterOutlet, RouterModule, NavbarComponent, DateFormatPipe, AsyncPipe, CommonModule],
  templateUrl: './app.component.html',
  styleUrl: './app.component.css'
})
export class AppComponent {
  title = 'TodoList';
  
   currentDate: Date = new Date();
 

 
}
