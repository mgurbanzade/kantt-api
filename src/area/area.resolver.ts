import {
  Resolver,
  Query,
  Mutation,
  Args,
  ResolveField,
  Parent,
} from '@nestjs/graphql';
import { UseGuards } from '@nestjs/common';
import { Prisma } from '@prisma/client';
import { JwtAuthGuard } from '@src/auth/jwt-auth.guard';
import { Area, Project } from '@src/types/graphql';
import { AreaAuthorGuard } from './guards/area-author.guard';
import { AreaService } from './area.service';
import { CurrentUser } from '@src/user/user.decorator';

@Resolver('Area')
export class AreaResolver {
  constructor(private readonly areaService: AreaService) {}

  @Mutation('createArea')
  @UseGuards(JwtAuthGuard)
  create(
    @Args('createAreaInput')
    createAreaInput: Prisma.AreaCreateInput,
    @CurrentUser() user: { userId: number },
  ) {
    return this.areaService.create(createAreaInput, user.userId);
  }

  @Query('getAllAreas')
  @UseGuards(JwtAuthGuard)
  findAll(
    @Args('where') where: Prisma.AreaWhereInput,
    @CurrentUser() user: { userId: number },
  ) {
    return this.areaService.findAll(where, user.userId);
  }

  @Query('getArchivedAreas')
  @UseGuards(JwtAuthGuard)
  findArchived(@CurrentUser() user: { userId: number }) {
    return this.areaService.findArchived(user.userId);
  }

  @Query('getArea')
  @UseGuards(JwtAuthGuard)
  findOne(@Args('uuid') uuid: string) {
    return this.areaService.findOne({ uuid });
  }

  @Mutation('updateArea')
  @UseGuards(JwtAuthGuard, AreaAuthorGuard)
  update(
    @Args('uuid') uuid: string,
    @Args('updateAreaInput')
    updateAreaInput: Prisma.AreaUpdateInput,
  ) {
    return this.areaService.update(uuid, updateAreaInput);
  }

  @Mutation('removeArea')
  @UseGuards(JwtAuthGuard, AreaAuthorGuard)
  remove(@Args('uuid') uuid: string) {
    return this.areaService.remove({ uuid });
  }

  @Mutation('archiveArea')
  @UseGuards(JwtAuthGuard, AreaAuthorGuard)
  archive(@Args('uuid') uuid: string) {
    return this.areaService.archive(uuid);
  }

  @Mutation('unarchiveArea')
  @UseGuards(JwtAuthGuard, AreaAuthorGuard)
  unarchive(@Args('uuid') uuid: string) {
    return this.areaService.unarchive(uuid);
  }

  // Fields

  @ResolveField(() => Area)
  parent(@Parent() area: Area) {
    return this.areaService.parent(area.parentId);
  }

  @ResolveField(() => [Project])
  projects(@Parent() area: Area) {
    return this.areaService.projects(area.id);
  }

  @ResolveField(() => [Area])
  subareas(@Parent() area: Area) {
    return this.areaService.subareas(area.id);
  }
}
