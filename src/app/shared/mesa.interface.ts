
export class Mesa {
  id: string;
  numero: number;
  cantidad: number;
  img: string;
  tipo: 'COMUN' | 'DISCAPACITADOS' | 'VIP';
  estado: 'DISPONIBLE' | 'RESERVADO';
}