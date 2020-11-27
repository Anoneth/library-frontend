import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { ReactiveFormsModule, FormsModule } from '@angular/forms';
import { HttpClientModule, HTTP_INTERCEPTORS } from '@angular/common/http';
import { RouterModule, Routes } from '@angular/router';
import { AppComponent } from './app.component';
import { HomeComponent } from './home/home.component';
import { LoginComponent } from './login/login.component';
import { AuthGuard } from './auth.guard';
import { AuthAndHttpErrorInterceptor, NetworkService } from './network.service';
import { AuthService } from './auth.service';
import { AuthorComponent } from './author/author.component';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { MatButtonModule } from '@angular/material/button'
import { MatToolbarModule } from '@angular/material/toolbar'
import { MatTableModule } from '@angular/material/table'
import { MatSortModule } from '@angular/material/sort'
import { MatInputModule } from '@angular/material/input'
import { MatFormFieldModule } from '@angular/material/form-field'
import { MatIconModule } from '@angular/material/icon'
import { MatCardModule } from '@angular/material/card'
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { BookComponent } from './book/book.component';
import { AuthorDialogComponent } from './author-dialog/author-dialog.component'
import { MatDialogModule } from '@angular/material/dialog';
import { MatMenuModule } from '@angular/material/menu';
import { BookDialogComponent } from './book-dialog/book-dialog.component';
import { BookEditionDialogComponent } from './book-edition-dialog/book-edition-dialog.component';
import { BookEditionComponent } from './book-edition/book-edition.component';
import { PublishingHouseComponent } from './publishing-house/publishing-house.component';
import { PublishingHouseDialogComponent } from './publishing-house-dialog/publishing-house-dialog.component';
import { UserComponent } from './user/user.component';
import { UserDialogComponent } from './user-dialog/user-dialog.component';
import { CopyOfTheBookComponent } from './copy-of-the-book/copy-of-the-book.component';
import { CopyOfTheBookDialogComponent } from './copy-of-the-book-dialog/copy-of-the-book-dialog.component';
import { LibraryDepartmentComponent } from './library-department/library-department.component';
import { LibraryDepartmentDialogComponent } from './library-department-dialog/library-department-dialog.component'
import { MatAutocompleteModule } from '@angular/material/autocomplete'
import { MatChipsModule } from '@angular/material/chips';
import { ErrorDialogComponent } from './error-dialog/error-dialog.component'

const routes: Routes = [
  { path: '', pathMatch: 'full', redirectTo: 'home'},
  { path: 'home', component: HomeComponent},
  { path: 'authors', component: AuthorComponent, canActivate: [AuthGuard]},
  { path: 'books', component: BookComponent, canActivate: [AuthGuard]},
  { path: 'book-editions', component: BookEditionComponent, canActivate: [AuthGuard]},
  { path: 'cotbs', component: CopyOfTheBookComponent, canActivate: [AuthGuard]},
  { path: 'pub-houses', component: PublishingHouseComponent, canActivate: [AuthGuard]},
  { path: 'lib-deps', component: LibraryDepartmentComponent, canActivate: [AuthGuard]},
  { path: 'users', component: UserComponent, canActivate: [AuthGuard]},
  { path: 'login', component: LoginComponent}
];

@NgModule({
  declarations: [
    AppComponent,
    HomeComponent,
    LoginComponent,
    AuthorComponent,
    BookComponent,
    AuthorDialogComponent,
    BookDialogComponent,
    BookEditionDialogComponent,
    BookEditionComponent,
    PublishingHouseComponent,
    PublishingHouseDialogComponent,
    UserComponent,
    UserDialogComponent,
    CopyOfTheBookComponent,
    CopyOfTheBookDialogComponent,
    LibraryDepartmentComponent,
    LibraryDepartmentDialogComponent,
    ErrorDialogComponent
  ],
  imports: [
    RouterModule.forRoot(routes),
    BrowserModule,
    HttpClientModule,
    FormsModule,
    ReactiveFormsModule,
    BrowserAnimationsModule,
    MatButtonModule,
    MatTableModule,
    MatToolbarModule,
    MatSortModule,
    MatFormFieldModule,
    MatInputModule,
    MatIconModule,
    MatCardModule,
    MatProgressSpinnerModule,
    MatDialogModule,
    MatMenuModule,
    MatAutocompleteModule,
    MatChipsModule
  ],
  providers: [NetworkService, AuthService, { provide: HTTP_INTERCEPTORS, useClass: AuthAndHttpErrorInterceptor, multi: true}],
  bootstrap: [AppComponent],
  entryComponents: [AuthorDialogComponent,
    BookDialogComponent,
    BookEditionDialogComponent,
    CopyOfTheBookDialogComponent,
    PublishingHouseDialogComponent,
    UserDialogComponent,
    LibraryDepartmentDialogComponent,
    ErrorDialogComponent
  ]
})
export class AppModule { }