import { Module } from '@nestjs/common';
import { UploadModule } from '../upload/upload.module';
import { MotosController } from './motos.controller';
import { MotosService } from './motos.service';

@Module({
  imports: [UploadModule],
  controllers: [MotosController],
  providers: [MotosService],
})
export class MotosModule {}
