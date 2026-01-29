import { NgOptimizedImage } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { IonHeader } from '@ionic/angular/standalone';

@Component({
  selector: 'app-auth-logo',
  templateUrl: './auth-logo.component.html',
  styleUrls: ['./auth-logo.component.scss'],
  standalone: true,
  imports: [IonHeader, NgOptimizedImage],
})
export class AuthLogoComponent implements OnInit {
  constructor() {}

  ngOnInit() {}
}
