import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup } from '@angular/forms';
import { Signup } from 'src/app/common/signup';

@Component({
  selector: 'app-registration',
  templateUrl: './registration.component.html',
  styleUrls: ['./registration.component.css']
})
export class RegistrationComponent implements OnInit{
  
  public registrationForm!: FormGroup;



  ngOnInit(): void {
    this.registrationForm = new FormGroup({
      email: new FormControl(""),
      name: new FormControl(""),
      username: new FormControl(""),
      password: new FormControl("")
    });
  }

  onSubmit(): void {
    let signUp = new Signup();

    signUp.email = this.registrationForm.controls["email"].value;
    signUp.name =  this.registrationForm.controls["name"].value;
    signUp.password = this.registrationForm.controls["username"].value;
    signUp.username = this.registrationForm.controls["password"].value;

    

  }
}
