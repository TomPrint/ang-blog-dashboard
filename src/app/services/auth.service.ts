import { Injectable } from '@angular/core';
import { Auth,authState  } from '@angular/fire/auth';
import { ToastrService } from 'ngx-toastr';
import { Router } from '@angular/router';
import {
  signInWithEmailAndPassword,
  signOut,
} from '@angular/fire/auth';
import { BehaviorSubject, Observable } from 'rxjs';
import { Userdata } from '../models/userdata';


@Injectable({
  providedIn: 'root'
})

export class AuthService {

  loggedIn: BehaviorSubject<boolean> = new BehaviorSubject<boolean>(false)
  isLoggedInGuard:boolean = false;

  constructor(private auth:Auth, private toastr: ToastrService, private route: Router) {}

  login({ email, password }: Userdata) {
    return signInWithEmailAndPassword(this.auth, email, password)
    .then(() => {
      this.toastr.success('Login Successful');
      this.loadUser();
      this.loggedIn.next(true);
      this.isLoggedInGuard = true
      this.route.navigate(['/']);
    })
    .catch((e) => this.toastr.error('Wrong Email or Password'))
  }

  loadUser(){
    authState(this.auth).subscribe(user=>{
      // console.log(JSON.parse(JSON.stringify(user)) );
      localStorage.setItem('user', JSON.stringify(user))
    })
  }

  logOut(){
    return signOut(this.auth).then(() => {
      this.toastr.success('User Logged Out Successfully')
      localStorage.removeItem('user');
      this.loggedIn.next(false);
      this.isLoggedInGuard = false;
      this.route.navigate(['/login'])
  })
  }

  isLogedIn():Observable<boolean>{
    return this.loggedIn.asObservable()
  }

}