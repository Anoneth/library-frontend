import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { AuthService } from './auth.service';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent {
  constructor(private auth: AuthService, private router: Router) { }

  get isAuth() {
    return this.auth.isAuth()
  }

  logout() {
    this.auth.removeAuth()
    this.router.navigateByUrl('')
  }

}