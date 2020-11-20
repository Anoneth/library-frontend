import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { AuthService } from '../auth.service';

@Component({
  templateUrl: './login.component.html'
})
export class LoginComponent {

  credentials = {username: '', password: ''};

  error = false

  returnUrl = ""

  constructor(private auth: AuthService, private router: Router, private route: ActivatedRoute) {
    route.queryParams.subscribe(params => {
      this.returnUrl = params['returnUrl'] || ''
    })
  }

  login() {
    this.auth.login(this.credentials).then(() => {
      if (this.auth.authenticated) {
        this.router.navigateByUrl(this.returnUrl)
      }
    })
  }

}