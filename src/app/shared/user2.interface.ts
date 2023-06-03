export interface User2 {
    uid: string;
    nombre: string;
    apellido: string;
    dni: number;
    img: string;
    correo: string;
    fechaCreacion: number;
    estado: 'ACEPTADO' | 'PENDIENTE' | 'RECHAZADO';
}