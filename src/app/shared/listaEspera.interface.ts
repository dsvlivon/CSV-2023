export class ListaEspera {
    id: string;
    estado: 'PENDIENTE' | 'EN USO' | 'CANCELADO' | 'FINALIZADO';
    correo: string;
    date_created: number;
    user_uid?: string;
  }
  