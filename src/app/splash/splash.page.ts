import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { IonicModule } from '@ionic/angular';
import { Router } from '@angular/router';

@Component({
  selector: 'app-splash',
  templateUrl: './splash.page.html',
  styleUrls: ['./splash.page.scss'],
  standalone: true,
  imports: [IonicModule, CommonModule, FormsModule]
})
export class SplashPage implements OnInit {

  constructor(private router: Router) {
    // setTimeout(() => {
    //   this.router.navigateByUrl('login');
    // }, 10000)
   }

  ngOnInit() {
    setTimeout(() => {
      this.router.navigate(['/splash2']);
    }, 3000); // 3000 milisegundos = 3 segundos
  }

}
