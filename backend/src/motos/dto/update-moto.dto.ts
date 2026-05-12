import { PartialType } from '@nestjs/swagger';
import { CreateMotoDto } from './create-moto.dto';

export class UpdateMotoDto extends PartialType(CreateMotoDto) {}
