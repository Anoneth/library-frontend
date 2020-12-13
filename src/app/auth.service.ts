import { HttpErrorResponse, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { NetworkService } from './network.service';

@Injectable({
  providedIn: 'root'
})
export class AuthService {

  private authenticated = false

  private errMsg = ""

  private userName: string = ""
  private userRoles: string[] = []

  getUserName(): string {
    return this.userName || 'empty'
  }

  getUserRoles(): string[] {
    return this.userRoles
  }

  canDelete(): boolean {
    return this.authenticated && this.userRoles.includes("ROLE_ADMIN")
  }

  constructor(private network: NetworkService) {
    this.authenticated = localStorage.getItem('auth') != null
    if (this.authenticated) {
      this.userName = localStorage.getItem('userName')
      this.userRoles = localStorage.getItem('userRoles').split(';')
    }
  }

  async login(credentials) {
    const headers = new HttpHeaders(credentials ? {
      authorization: 'Basic ' + btoa(credentials.username + ':' + credentials.password)
    } : {});
    await this.network.get('/user', undefined, headers).toPromise().then(response => {
      if (!(response instanceof HttpErrorResponse) && 'name' in response) {
        this.saveUserName(response.principal.username)
        this.saveUserRoles(response.principal.authorities.map(x => x.authority))
        this.saveAuth('Basic ' + btoa(credentials.username + ':' + credentials.password))
        
        console.log(this.userName)
        console.log(this.userRoles)
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

  logout(reason?:string) {
    if (reason) {
      this.setErrMsg(reason)
    }
    this.removeAuth()
    this.removeUserName()
    this.removeUserRoles()
  }

  private saveAuth(str: string) {
    this.errMsg = ""
    this.authenticated = true
    localStorage.setItem('auth', str)
  }

  private setErrMsg(msg: string) {
    this.errMsg = msg
  }

  private removeAuth() {
    this.authenticated = false
    localStorage.removeItem('auth')
  }

  private saveUserName(name: string) {
    this.userName = name
    localStorage.setItem('userName', name)
  }

  private saveUserRoles(roles: string[]) {
    this.userRoles = roles
    localStorage.setItem('userRoles', roles.join(';'))
  }

  private removeUserName() {
    this.userName = ""
    localStorage.removeItem('userName')
  }

  private removeUserRoles() {
    this.userRoles = []
    localStorage.removeItem('userRoles')
  }
  
}
