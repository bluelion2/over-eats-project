import { Component, OnInit, Input } from '@angular/core';
import { FormGroup } from '@angular/forms';
import { AuthService } from '../services/auth.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-login',
  template: `
    <div class="centered">
        <app-auth-form (submitted)="loginUser($event)">
          <h1 class="form-title">로그인하기</h1>
          <p class="form-sub">이메일 계정으로
간편하게 오버잇츠를 만나보세요!</p>
          <span>아직 회원이 아닌가요?</span>
          <a
            class="text-link"
            routerLink="/auth/signup">
          회원가입
          </a>
          <button
            type="submit"
            class="button uber button-fluid">
            로그인하기
          </button>
          </app-auth-form>
    </div>
  `
})
export class LoginComponent implements OnInit {
  message: string;

  constructor() { }

  ngOnInit() {
  }

  loginUser(event: FormGroup) {
    const userName = event.value.email;
    const password = event.value.password;
    console.log(userName, password);

  }

}
