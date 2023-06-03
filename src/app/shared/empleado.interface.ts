import { User2 } from "./user2.interface";

export interface Empleado extends User2 {
    perfil: 'EMPLEADO';
    rol: 'METRE' | 'MOZO' | 'COCINERO' | 'BARTENDER';
    cuil: number;

}