export interface User2 {
    nombre: string;
    apellido?: string;
    dni?: number;
    img?: string;
    correo?: string;
    password?: string;
    fechaCreacion?: number;
    estado?: 'ACEPTADO' | 'PENDIENTE' | 'RECHAZADO';
    perfil: 'DUENIO' | 'SUPERVISOR' | 'EMPLEADO' | 'CLIENTE' | 'ANONIMO';
    rol?: 'METRE' | 'MOZO' | 'COCINERO' | 'BARTENDER';
    cuil?: number;
    
}