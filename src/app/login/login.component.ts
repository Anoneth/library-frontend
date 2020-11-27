import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { AuthService } from '../auth.service';
import { FormGroup, FormBuilder, Validators } from '@angular/forms'

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})

export class LoginComponent implements OnInit {

  loginReactiveForm: FormGroup

  credentials = {username: '', password: ''};

  error = ""

  showSpinner = false

  returnUrl = ""

  constructor(private auth: AuthService, private router: Router, private route: ActivatedRoute, private formBuilder: FormBuilder) {
    route.queryParams.subscribe(params => {
      this.returnUrl = params['returnUrl'] || ''
    })
  }

  ngOnInit() {
    this.initForm()
    this.error = this.auth.getErrMsg()
  }

  initForm() {
    this.loginReactiveForm = this.formBuilder.group({
      username: [
        '',
        Validators.required,
      ],
      password: [
        '',
        Validators.required
      ]
    })
  }

  controlIsInvalid(controlName: string) {
    let control = this.loginReactiveForm.controls[controlName]
    return control.invalid && (control.touched || control.dirty)
  }

  login() {
    let username = this.loginReactiveForm.controls['username']
    let password = this.loginReactiveForm.controls['password']
    let isOk = true
    if (username.invalid) {
      username.markAsTouched()
      isOk = false
    }
    if (password.invalid) {
      password.markAsTouched()
      isOk = false
    }
    if (!isOk) return
    this.credentials.username = username.value
    this.credentials.password = password.value
    this.showSpinner = true
    this.error = ""
    this.auth.login(this.credentials).then(() => {
      if (this.auth.isAuth()) {
        this.router.navigateByUrl(this.returnUrl)
      }
      this.error = this.auth.getErrMsg()
      this.showSpinner = false
    })
  }

}

