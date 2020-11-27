import { HttpErrorResponse, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { NetworkService } from './network.service';

@Injectable({
  providedIn: 'root'
})
export class AuthService {

  private authenticated = false

  private errMsg = ""

  constructor(private network: NetworkService) {
    this.authenticated = localStorage.getItem('auth') != null
  }

  async login(credentials) {
    const headers = new HttpHeaders(credentials ? {
      authorization: 'Basic ' + btoa(credentials.username + ':' + credentials.password)
    } : {});
    await this.network.get('/users', undefined, headers).toPromise().then(response => {
      if (!(response instanceof HttpErrorResponse) && 'name' in response) {
        this.saveAuth('Basic ' + btoa(credentials.username + ':' + credentials.password))
      }
    }, error => {
      if (error.status == 401) {
        this.errMsg = "Bad login/password"
      }
      else {
        this.errMsg = "Server error"
      }
    })
  }

  getErrMsg(): string {
    return this.errMsg;
  }

  isAuth(): boolean {
    return this.authenticated
  }

  getAuth(): string {
    return this.authenticated ? localStorage.getItem("auth") : ''
  }

  saveAuth(str: string) {
    this.errMsg = ""
    this.authenticated = true
    localStorage.setItem('auth', str)
  }

  setErrMsg(msg: string) {
    this.errMsg = msg
  }

  removeAuth() {
    this.authenticated = false
    localStorage.removeItem('auth')
  }
}
