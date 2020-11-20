import { HttpErrorResponse, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { NetworkService } from './network.service';

@Injectable({
  providedIn: 'root'
})
export class AuthService {

  authenticated = false

  constructor(private network: NetworkService) { }

  async login(credentials) {
    const headers = new HttpHeaders(credentials ? {
      authorization: 'Basic ' + btoa(credentials.username + ':' + credentials.password)
    } : {});
    await this.network.get('/user', undefined, headers).toPromise().then(response => {
      if (!(response instanceof HttpErrorResponse) && 'name' in response) {
        this.saveAuth('Basic ' + btoa(credentials.username + ':' + credentials.password))
      }
    })
  }

  isAuth(): boolean {
    return this.authenticated
  }

  getAuth(): string {
    return this.authenticated ? localStorage.getItem("auth") : ''
  }

  saveAuth(str: string) {
    this.authenticated = true
    localStorage.setItem('auth', str)
  }

  removeAuth() {
    this.authenticated = false
    localStorage.removeItem('auth')
  }
}
