import { Module } from '@nestjs/common';
import { AreaService } from './area.service';
import { AreaResolver } from './area.resolver';

@Module({
  providers: [AreaResolver, AreaService],
})
export class AreaModule {}
