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
import { ResourceService } from './resource.service';
import {
  ConnectResourceInput,
  Resource,
  ResourceWhereInput,
  Task,
} from '@src/types/graphql';
import { JwtAuthGuard } from '@src/auth/jwt-auth.guard';
import { CreateResourceInput } from '@src/types/graphql';

@Resolver('Resource')
export class ResourceResolver {
  constructor(private readonly resourceService: ResourceService) {}

  @Mutation('createResource')
  // @UseGuards(JwtAuthGuard)
  create(
    @Args('createResourceInput')
    createResourceInput: CreateResourceInput,
    @Args('connectResourceInput') connectResourceInput: ConnectResourceInput,
  ) {
    return this.resourceService.create(
      createResourceInput,
      connectResourceInput,
    );
  }

  @Query('getAllResources')
  @UseGuards(JwtAuthGuard)
  findAll(@Args('where') where: Prisma.ResourceWhereInput) {
    return this.resourceService.findAll(where);
  }

  @Query('getResource')
  // @UseGuards(JwtAuthGuard)
  findOne(@Args('where') where: ResourceWhereInput) {
    const { uuid } = where;

    if (uuid) {
      return this.resourceService.findOne({ uuid });
    } else {
      return this.resourceService.getRootResource();
    }
  }

  @Mutation('updateResource')
  // @UseGuards(JwtAuthGuard)
  update(
    @Args('id') id: number,
    @Args('updateResourceInput')
    updateResourceInput: Prisma.ResourceUpdateInput,
  ) {
    return this.resourceService.update(id, updateResourceInput);
  }

  @Mutation('removeResource')
  // @UseGuards(JwtAuthGuard)
  remove(@Args('id') id: number) {
    return this.resourceService.remove({ id });
  }

  // Fields
  @ResolveField(() => Resource)
  project(@Parent() resource) {
    return this.resourceService.project(resource.id);
  }

  @ResolveField(() => Task)
  task(@Parent() task) {
    return this.resourceService.project(task.id);
  }

  @ResolveField(() => [Resource])
  subResources(@Parent() resource: Resource) {
    return this.resourceService.subResources(resource.id);
  }
}
