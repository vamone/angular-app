import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { LoginComponent } from './_components/login/app.login';
import { User } from './_models/user';
import { AuthService } from './_services/auth.service';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html'
})
export class AppComponent {

  currentUser: User;

  constructor(
    private router: Router,
    private authService: AuthService
  ) {
    this.currentUser = new User();
    this.authService.currentUser.subscribe(x => this.currentUser = x);
  }

  onLogout() {

    console.log('Logging out');

    this.authService.logout();
    this.router.navigate(['/login']);
  }
}
