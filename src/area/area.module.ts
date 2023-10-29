import { Module } from '@nestjs/common';
import { AreaService } from './Area.service';
import { AreaResolver } from './Area.resolver';

@Module({
  providers: [AreaResolver, AreaService],
})
export class AreaModule {}
