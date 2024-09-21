import { Paginator } from '@/common';

export class ReservaPaginator extends Paginator {
  desde: string;
  hasta: string;
  n_socio: string;
  correo: string;
  estado: number;
  fecha_creado: string;
  usuario_aprobador: string;
  casa_mutual: string;
  delegacion: string;
}
