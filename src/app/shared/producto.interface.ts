export class Producto {
    id: string;
    descripcion: string;
    tiempo: number;
    precio: number;
    tipo: 'BEBIDA' | 'COMIDA' | 'POSTRE';
    img: string[];
}