import { Component, OnInit, EventEmitter, Output, Input, ChangeDetectorRef } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { IpcService } from '../add-text/ipc.service';
import { ipcEvents } from '../../shared/ipc-events.enum';
import { Router } from '@angular/router';
import { Routes } from '../../shared/routes.enum';

@Component({
  selector: 'app-signup',
  templateUrl: './signup.component.html',
  styleUrls: ['./signup.component.scss']
})
export class SignupComponent implements OnInit {

  public signupForm: FormGroup;

  public incorrectData: boolean = false;


  constructor(
    private readonly formBuilder: FormBuilder,
    private readonly ipcService: IpcService,
    private readonly changeDetector: ChangeDetectorRef,
    private readonly router: Router,
  ) {}


  public ngOnInit(): void {
    this.signupForm = this.formBuilder.group({
      username: this.formBuilder.control('', Validators.required),
      password: this.formBuilder.control('', Validators.required),
      repeatPassword: this.formBuilder.control('', Validators.required),
      email: this.formBuilder.control('', [Validators.required, Validators.email]),
    });

    this.signupForm.valueChanges.subscribe(() => this.incorrectData = false);
  }


  public onSignup(): void {
    if (this.signupForm.invalid) {
      return;
    }

    if (this.signupForm.get('password').value !== this.signupForm.get('repeatPassword').value) {
      this.incorrectData = true;
      return;
    }

    this.ipcService.ipc.send(ipcEvents.SIGNUP, {
      username: this.signupForm.get('username').value,
      password: this.signupForm.get('password').value,
      email: this.signupForm.get('email').value,
    });
  
  }


  public onBack(): void {
    this.router.navigateByUrl(Routes.LOGIN);
  }

}
