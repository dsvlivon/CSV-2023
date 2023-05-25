import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { IonicModule } from '@ionic/angular';
import { Router } from '@angular/router';

@Component({
  selector: 'app-splash2',
  templateUrl: './splash2.page.html',
  styleUrls: ['./splash2.page.scss'],
  standalone: true,
  imports: [IonicModule, CommonModule, FormsModule]
})
export class Splash2Page implements OnInit {

  constructor(private router: Router) {
    setTimeout(() => {
      this.router.navigateByUrl('login');
    }, 2500)
   }

  ngOnInit() {
  }

}
