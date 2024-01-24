import {
  Resolver,
  Query,
  Mutation,
  Args,
  ResolveField,
  Parent,
} from '@nestjs/graphql';
// import { UseGuards } from '@nestjs/common';
import { Prisma } from '@prisma/client';
import { AreaService } from './Area.service';
// import { JwtAuthGuard } from '@src/auth/jwt-auth.guard';
import { Area, Project } from '@src/types/graphql';

@Resolver('Area')
export class AreaResolver {
  constructor(private readonly areaService: AreaService) {}

  @Mutation('createArea')
  // @UseGuards(JwtAuthGuard)
  create(
    @Args('createAreaInput')
    createAreaInput: Prisma.AreaCreateInput,
  ) {
    return this.areaService.create(createAreaInput);
  }

  @Query('getAllAreas')
  // @UseGuards(JwtAuthGuard)
  findAll(@Args('where') where: Prisma.AreaWhereInput) {
    return this.areaService.findAll(where);
  }

  @Query('getArchivedAreas')
  // @UseGuards(JwtAuthGuard)
  findArchived() {
    return this.areaService.findArchived();
  }

  @Query('getArea')
  // @UseGuards(JwtAuthGuard)
  findOne(@Args('uuid') uuid: string) {
    return this.areaService.findOne({ uuid });
  }

  @Mutation('updateArea')
  // @UseGuards(JwtAuthGuard, AuthorGuard)
  update(
    @Args('id') id: number,
    @Args('updateAreaInput')
    updateAreaInput: Prisma.AreaUpdateInput,
  ) {
    return this.areaService.update(id, updateAreaInput);
  }

  @Mutation('removeArea')
  // @UseGuards(JwtAuthGuard, AuthorGuard)
  remove(@Args('id') id: number) {
    return this.areaService.remove({ id });
  }

  @Mutation('archiveArea')
  // @UseGuards(JwtAuthGuard, AuthorGuard)
  archive(@Args('id') id: number) {
    return this.areaService.archive(id);
  }

  @Mutation('unarchiveArea')
  // @UseGuards(JwtAuthGuard, AuthorGuard)
  unarchive(@Args('id') id: number) {
    return this.areaService.unarchive(id);
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
