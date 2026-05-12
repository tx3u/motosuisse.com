import { plainToInstance } from 'class-transformer';
import { FilterMotoDto } from './filter-moto.dto';

describe('FilterMotoDto', () => {
  it('coerces string query params to their numeric types', () => {
    const dto = plainToInstance(FilterMotoDto, {
      prix_min: '1000',
      prix_max: '8000',
      kilometrage_max: '50000',
      page: '2',
      limit: '10',
    });

    expect(dto.prix_min).toBe(1000);
    expect(dto.prix_max).toBe(8000);
    expect(dto.kilometrage_max).toBe(50000);
    expect(dto.page).toBe(2);
    expect(dto.limit).toBe(10);
  });

  it('coerces featured="true" string to boolean true', () => {
    const dto = plainToInstance(FilterMotoDto, { featured: 'true' });
    expect(dto.featured).toBe(true);
  });

  it('coerces featured="false" string to boolean false', () => {
    const dto = plainToInstance(FilterMotoDto, { featured: 'false' });
    expect(dto.featured).toBe(false);
  });

  it('coerces featured=true boolean to boolean true', () => {
    const dto = plainToInstance(FilterMotoDto, { featured: true });
    expect(dto.featured).toBe(true);
  });
});
