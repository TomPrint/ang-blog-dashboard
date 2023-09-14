import { Injectable } from '@angular/core';
import { ActivatedRouteSnapshot, Router, RouterStateSnapshot, UrlTree } from '@angular/router';
import { Observable } from 'rxjs';
import { AuthService } from './auth.service';
import { ToastrService } from 'ngx-toastr';

@Injectable({
  providedIn: 'root'
})
export class AuthGuard {

  constructor(private authService: AuthService, private toastr: ToastrService, private router: Router) { }
  canActivate():
    | Observable<boolean | UrlTree>
    | Promise<boolean | UrlTree>
    | boolean
    | UrlTree {
    if (!this.authService.isLoggedInGuard) {
      this.toastr.warning('Please Log In!');
      this.router.navigate(['/login']);
      return false;
    } else {}
    // logged in, so return true
    this.authService.isLoggedInGuard;
    return true;
  }
}

// Alternatywnie poniżej

// import { Injectable } from '@angular/core';
// import { ActivatedRouteSnapshot, Router, RouterStateSnapshot } from '@angular/router';
// import { AuthService } from './auth.service';
// import { ToastrService } from 'ngx-toastr';

// @Injectable({
// providedIn: 'root'
// })
// export class AuthGuard {

// constructor(private authService: AuthService, private toastr: ToastrService, private router: Router) { }

// canActivate(route: ActivatedRouteSnapshot): boolean {
// if (!this.authService.isLoggedInGuard) {
// this.toastr.warning('Please Log In!');
// this.router.navigate(['/login']);
// return false;
// }
// return true;
// }

// canActivateChild(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): boolean {
// if (!this.authService.isLoggedInGuard) {
// return false;
// }
// return true;
// }
// }
