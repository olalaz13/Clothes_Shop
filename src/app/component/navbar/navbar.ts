import { Component } from '@angular/core';
import { Router } from '@angular/router';

@Component({
  selector: 'app-navbar',
  templateUrl: './navbar.html',
  styleUrls: ['./navbar.css']
})
export class Navbar {
  constructor(private router: Router) {}

  goHome() {
    this.router.navigate(['/']); 
  }

  goAbout() {
    this.router.navigate(['/about']); 
  }

  goContact() {
    this.router.navigate(['/contact']); 
  }

  goSignIn() {
    this.router.navigate(['/signin']); 
  }

  goShop() {
    this.router.navigate(['/shop']); 
  }
}
