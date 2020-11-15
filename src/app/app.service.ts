import { Injectable } from '@angular/core';
import { HttpClient, HttpHandler, HttpHeaders, HttpInterceptor, HttpRequest } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable()
export class AppService {

  authenticated = false;
  server_url = 'http://localhost:8080'
  headers = {}

  constructor(private http: HttpClient) {
  }

  authenticate(credentials, callback) {

    const headers = new HttpHeaders(credentials ? {
      authorization: 'Basic ' + btoa(credentials.username + ':' + credentials.password)
    } : {});

    this.http.get(this.server_url + '/user', { headers: headers}).subscribe(response => {
      if (response['name']) {
        this.authenticated = true;
        this.headers = new HttpHeaders({
          authorization: 'Basic ' + btoa(credentials.username + ':' + credentials.password)
        });
      } else {
        this.authenticated = false;
      }
      console.log(response)
      return callback && callback();
    });

  }
  loadAuthors() : Observable<string> {
    return this.http.get<string>(this.server_url + '/authors', { headers: this.headers})
  }

}

@Injectable()
export class XhrInterceptor implements HttpInterceptor {

  intercept(req: HttpRequest<any>, next: HttpHandler) {
    const xhr = req.clone({
      headers: req.headers.set('X-Requested-With', 'XMLHttpRequest')
    });
    return next.handle(xhr);
  }
}