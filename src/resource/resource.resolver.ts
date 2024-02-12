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
import { CurrentUser } from '@src/user/user.decorator';
import { ResourceAuthorGuard } from './guards/resource-author.guard';

@Resolver('Resource')
export class ResourceResolver {
  constructor(private readonly resourceService: ResourceService) {}

  @Mutation('createResource')
  @UseGuards(JwtAuthGuard)
  create(
    @Args('createResourceInput')
    createResourceInput: CreateResourceInput,
    @Args('connectResourceInput') connectResourceInput: ConnectResourceInput,
    @CurrentUser() user: { userId: number },
  ) {
    return this.resourceService.create(
      createResourceInput,
      connectResourceInput,
      user.userId,
    );
  }

  @Query('getAllResources')
  @UseGuards(JwtAuthGuard)
  findAll(
    @Args('where') where: Prisma.ResourceWhereInput,
    @CurrentUser() user: { userId: number },
  ) {
    return this.resourceService.findAll(where, user.userId);
  }

  @Query('getArchivedResources')
  @UseGuards(JwtAuthGuard)
  findArchived(@CurrentUser() user: { userId: number }) {
    return this.resourceService.findArchived(user.userId);
  }

  @Query('getResource')
  @UseGuards(JwtAuthGuard, ResourceAuthorGuard)
  findOne(
    @Args('where') where: ResourceWhereInput,
    @CurrentUser() user: { userId: number },
  ) {
    const { uuid } = where;

    if (uuid && uuid !== 'ROOT') {
      return this.resourceService.findOne({ uuid });
    } else {
      return this.resourceService.getRootResource(user.userId);
    }
  }

  @Mutation('updateResource')
  @UseGuards(JwtAuthGuard, ResourceAuthorGuard)
  update(
    @Args('uuid') uuid: string,
    @Args('updateResourceInput')
    updateResourceInput: Prisma.ResourceUpdateInput,
  ) {
    return this.resourceService.update(uuid, updateResourceInput);
  }

  @Mutation('removeResource')
  @UseGuards(JwtAuthGuard, ResourceAuthorGuard)
  remove(@Args('uuid') uuid: string) {
    return this.resourceService.remove({ uuid });
  }

  @Mutation('archiveResource')
  @UseGuards(JwtAuthGuard, ResourceAuthorGuard)
  archive(@Args('uuid') uuid: string) {
    return this.resourceService.archive(uuid);
  }

  @Mutation('unarchiveResource')
  @UseGuards(JwtAuthGuard, ResourceAuthorGuard)
  unarchive(@Args('uuid') uuid: string) {
    return this.resourceService.unarchive(uuid);
  }

  // Fields
  @ResolveField(() => Resource)
  project(@Parent() resource) {
    return this.resourceService.project(resource.id);
  }

  @ResolveField(() => Task)
  task(@Parent() task) {
    return this.resourceService.task(task.id);
  }

  @ResolveField(() => [Resource])
  subResources(@Parent() resource: Resource) {
    return this.resourceService.subResources(resource.id);
  }
}
