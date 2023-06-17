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
import Swiper from 'swiper';
import { ProductoService } from 'src/app/services/productos.service';
import { Producto } from 'src/app/shared/producto.interface';

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

  productsSelected: any[] = [];
  prodSelected: any;

  constructor(private firestoreService: FirestoreService, private router: Router, private productoService: ProductoService) { }

  ngOnInit() {
    this.prodSelected = this.productos[0];
    this.getProds(this.prodSelected.val);
    //Si cliente volvio para atras y quiere cambiar algo del pedido
    this.checkProductsSelected();
  }

  private checkProductsSelected() {
    let a = JSON.parse(localStorage.getItem('products'));
    if (a) { this.productsSelected = a; }
  }

  getProds(filter: string) {
    switch (filter) {

      case 'Productos':
        this.prods$ = this.productoService.getAll();
        break;
    }
  }

  navigateBack(){
    this.router.navigateByUrl('/home', { replaceUrl: true });
  }
  
  setQuantity(model: any, action: '+' | '-') {
    
    if (action == '+') {
      model.quantity = this.getQuantity(model) + 1;
    }
    else {
      const quaa = this.getQuantity(model) - 1;
      if (quaa == -1) { model.quantity = 0; }
      else { model.quantity = quaa; }
    }

    if (model.quantity == 0) {
      let a = this.productsSelected.find(x => x.id == model.id);
      let index = this.productsSelected.indexOf(a);
      this.productsSelected.splice(index, 1);
    }
    else {
      this.productsSelected.push(model);
    }
  }
  getQuantity(model: Producto) {
    let quantity = 0;

    if (this.productsSelected) {
      this.productsSelected.forEach(p => {

        if (p.id == model.id) {
          quantity = p.quantity;
        }
      });
    }
    return quantity;
  }

  clickBeforeConfirm() {
   //Aca te redirecciona para el pedido
   localStorage.setItem('products', JSON.stringify(this.productsSelected));
  }

  getAcum() {
    let a = 0;
    this.productsSelected.forEach(p => { a += (p.quantity * p.precio); });
    return a;
  }

  getAproxFinish() {
    let minutos: number = 0;
    this.productsSelected.forEach(p => { minutos += p.tiempo; });
    return minutos;
  }

  expandedImage: string | null = null;

  expandImage(imageUrl: string): void {
    this.expandedImage = imageUrl;
  }
  
  closeExpandedImage(): void {
    this.expandedImage = null;
  }

}
