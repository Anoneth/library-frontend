import { HttpClient, HttpErrorResponse, HttpEvent, HttpHandler, HttpHeaders, HttpInterceptor, HttpParams, HttpRequest } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { Observable, throwError } from 'rxjs';
import { catchError } from 'rxjs/operators';
import { AuthService } from './auth.service';

@Injectable({
  providedIn: 'root'
})
export class NetworkService {

  SERVER_URL = "http://localhost:8080"

  constructor(private http: HttpClient) { }

  get(path: string, params?: HttpParams, headers?: HttpHeaders): Observable<any> {
    return this.http.get(this.SERVER_URL + path, { params: params, headers: headers })
  }
}

@Injectable()
export class AuthAndHttpErrorInterceptor implements HttpInterceptor {
  constructor(private auth: AuthService, private router: Router) { }
  intercept(req: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
    let headers: HttpRequest<any>
    if (this.auth.isAuth()) {
      headers = req.clone({
        setHeaders: {
          Authorization: this.auth.getAuth()
        }
      })
    } else {
      headers = req.clone()
    }
    return next.handle(headers).pipe(catchError((error: HttpErrorResponse) => {
      if (error.status == 401) {
        this.auth.removeAuth()
        this.router.navigate(['/login'])
      }
      return throwError(error)
    }))
  }
}