import { Injectable, PipeTransform } from '@nestjs/common';

@Injectable()
export class TrimPipe implements PipeTransform {
  private trim(value: unknown): unknown {
    if (typeof value === 'string') return value.trim();
    if (Array.isArray(value)) return value.map((v) => this.trim(v));
    if (typeof value === 'object' && value !== null) {
      return Object.fromEntries(
        Object.entries(value as Record<string, unknown>).map(([k, v]) => [k, this.trim(v)]),
      );
    }
    return value;
  }

  transform(value: unknown): unknown {
    return this.trim(value);
  }
}
