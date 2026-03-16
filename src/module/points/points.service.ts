import { Injectable } from '@nestjs/common';
import { PointsQueryService } from './services/points-query.service';

@Injectable()
export class PointsService {
  constructor(private readonly query: PointsQueryService) {}

  getClientPoints(clientId: string) { return this.query.getClientPoints(clientId); }
  getTransactions(clientId: string) { return this.query.getTransactions(clientId); }
}
