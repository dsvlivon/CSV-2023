export class Pedido {
    id: string;
    correo: string;
    mesa_numero: number;
    producto_id: [{ id: string, quantity: number, price: number, name: string }] | null;
    date_created: number;
    date_updated: number;
    estado: 'PENDIENTE' | 'CANCELADO' | 'ACEPTADO' | 'PREPARACION' | 'COCINADO' | 'ENTREGADO' | 'CONFIRMADO' | 'COBRAR' | 'COBRADO';
    encuestado: boolean;
    descuento10: 'NO JUGO' | 'GANO' | 'PERDIO';
    descuento15: 'NO JUGO' | 'GANO' | 'PERDIO';
    descuento20: 'NO JUGO' | 'GANO' | 'PERDIO';

}