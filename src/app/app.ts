import { Component, signal } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { Home } from "./component/home/home";
import { Navbar } from "./component/navbar/navbar";
import { Footer } from "./component/footer/footer";

@Component({
  selector: 'app-root',
  imports: [RouterOutlet, Home, Navbar, Footer],
  templateUrl: './app.html',
  styleUrl: './app.css'
})
export class App {
  protected readonly title = signal('test-angular');
}
