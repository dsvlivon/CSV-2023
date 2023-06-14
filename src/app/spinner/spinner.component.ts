import { Component, Input, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { IonicModule } from '@ionic/angular';
import { Router } from '@angular/router';
import { AuthService } from '../services/auth.service';
import { AnimationController } from '@ionic/angular';
import { ModalController } from '@ionic/angular';

@Component({
  selector: 'app-spinner',
  templateUrl: './spinner.component.html',
  styleUrls: ['./spinner.component.scss'],
  standalone: true,
  imports: [IonicModule, CommonModule, FormsModule]

})
export class SpinnerComponent implements OnInit {

  @Input() mostrar: boolean = false;


  constructor(private router: Router) { }

  ngOnInit() {
   /*  setTimeout(() => {
      this.mostrar = false;
    }, 4000); */
  }

  mostrarSpinner() {
    this.mostrar = !this.mostrar;
  }

}
