import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { IonicModule } from '@ionic/angular';
import { MailService } from 'src/app/services/mail.service';
import { User2 } from 'src/app/shared/user2.interface';
import { SpinnerComponent } from 'src/app/spinner/spinner.component';
import { Observable } from 'rxjs';
import { FirestoreService } from 'src/app/services/firestore.service';
import { Router } from '@angular/router';

import { ProductoService } from 'src/app/services/productos.service';

@Component({
  selector: 'app-menu-productos',
  templateUrl: './menu-productos.page.html',
  styleUrls: ['./menu-productos.page.scss'],
  standalone: true,
  imports: [IonicModule, CommonModule, FormsModule]
})
export class MenuProductosPage implements OnInit {
  prods$: Observable<any>;

  productos = [
    { val: 'Productos' },
  ]

  prodSelected: any;

  constructor(private firestoreService: FirestoreService, private router: Router, private productoService: ProductoService) { }

  ngOnInit() {
    this.prodSelected = this.productos[0];
    this.getProds(this.prodSelected.val);
  }

  getProds(filter: string) {
    switch (filter) {

      case 'ClieProductosntes':
        this.prods$ = this.productoService.getAll();
        break;
    }
  }

  navigateBack(){
    this.router.navigateByUrl('/home', { replaceUrl: true });
  }



}
