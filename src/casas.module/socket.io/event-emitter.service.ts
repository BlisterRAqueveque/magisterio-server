import { Injectable } from '@nestjs/common';
import { EventEmitter } from 'events';
import { IngresoParcelaDto } from '../ingreso-parcelas/dto/ingreso-parcela.dto';

@Injectable()
export class ParcelasEventEmitter {
  emitter = new EventEmitter();

  newIngreso(ingreso: IngresoParcelaDto) {
    this.emitter.emit('new-ingreso', ingreso);
  }

  updateIngreso(ingreso: IngresoParcelaDto) {
    this.emitter.emit('update-ingreso', ingreso);
  }
}
