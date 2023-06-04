export interface User2 {
    uid: string;
    nombre?: string;
    apellido?: string;
    dni?: number;
    img?: string;
    correo?: string;
    fechaCreacion?: number;
    estado: 'ACEPTADO' | 'PENDIENTE' | 'RECHAZADO';
    perfil: 'DUENIO' | 'SUPERVISOR' | 'EMPLEADO' | 'CLIENTE' | 'ANONIMO';
    rol?: 'METRE' | 'MOZO' | 'COCINERO' | 'BARTENDER';
    cuil?: number;

}