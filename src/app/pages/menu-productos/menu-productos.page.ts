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
import { PedidoService } from 'src/app/services/pedido.service';

@Component({
  selector: 'app-menu-productos',
  templateUrl: './menu-productos.page.html',
  styleUrls: ['./menu-productos.page.scss'],
  standalone: true,
  imports: [IonicModule, CommonModule, FormsModule, SpinnerComponent]
})
export class MenuProductosPage implements OnInit {

  prods$: Observable<any>;
  pedido$: Observable<any>;

  productos = [
    { val: 'Productos' },
  ]

  productsSelected: any[] = [];
  prodSelected: any;
  user:any;
  //Variable para definir si un producto esta en el array de productos
  encontreProducto: boolean = false;
  //Variable para mostrar spinner
  spinner: boolean = false;

  constructor(private firestoreService: FirestoreService, private router: Router, private productoService: ProductoService,private pedidoService: PedidoService) { }

  ngOnInit() {
    this.spinner = false;
    this.prodSelected = this.productos[0];
    this.getUser();
    this.getPedido();
    this.getProds(this.prodSelected.val);
    //Si cliente volvio para atras y quiere cambiar algo del pedido
    this.checkProductsSelected();
  }

  private checkProductsSelected() {
    //let a = JSON.parse(localStorage.getItem('products'));
    //if (a) { this.productsSelected = a; }
    //const id = this.route.snapshot.paramMap.get('id');
    this.pedidoService.getLastByUser(this.user.correo).subscribe((data)=>{
      console.log(data);
      let b = this.pedidoService.getById(data['id']).subscribe((datos)=>{
        //console.log(datos);
         this.productsSelected = datos['producto_id'];
         //alert(this.productsSelected);
        // b.unsubscribe();
      });
    });
  }

  getProds(filter: string) {
    switch (filter) {

      case 'Productos':
        this.prods$ = this.productoService.getAll();
        break;
    }
  }

  getUser(){
    this.user = null;
    this.user = JSON.parse(localStorage.getItem('user'));
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
    //console.log(model);
    if (model.quantity == 0) {
      let a = this.productsSelected.find(x => x.id == model.id);
      let index = this.productsSelected.indexOf(a);
      this.productsSelected.splice(index, 1);
    }
    else {
      //Agrego el primer producto
      if(this.productsSelected.length === 0)
      {
        this.productsSelected.push(model);
      }
      else{
       this.productsSelected.forEach((p)=>{
        if(p.id === model.id)
        {
          this.encontreProducto = true;
        }
       });
       if(this.encontreProducto === true){
         let b = this.productsSelected.find(x => x.id == model.id);
         let index2 = this.productsSelected.indexOf(b);
         this.productsSelected[index2].quantity = model.quantity;
         this.encontreProducto = false;
       }
       else{
        this.productsSelected.push(model);
       }
      }
      
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
   //localStorage.setItem('products', JSON.stringify(this.productsSelected));
   this.spinner = true;
   const a = this.pedido$.subscribe(data => {
    data.producto_id = this.productsSelected;
    this.pedidoService.updateOne(data).then(()=>{
      this.spinner = false;
      this.router.navigate(['/pedido/id/'+data.id],{ replaceUrl: true});
    });
    //this.router.navigate(['/pedido/id/'+data.id],{ replaceUrl: true});
    a.unsubscribe();
  });
  }

  getAcum() {
    let a = 0;
    this.productsSelected.forEach(p => { a += (p.quantity * p.precio); });
    return a;
  }

  private getPedido() {
    this.pedido$ = this.pedidoService.getLastByUser(this.user.correo);
  }

  getAproxFinish() {
    let minutos: number = 0;
    this.productsSelected.forEach(p => { 
      //minutos += p.tiempo; 
      if(minutos < p.tiempo){
        minutos = p.tiempo;
      }
    });
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
