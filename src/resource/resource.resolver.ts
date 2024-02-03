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
    console.log('user', user);
    return this.resourceService.create(
      createResourceInput,
      connectResourceInput,
      user.userId,
    );
  }

  @Query('getAllResources')
  @UseGuards(JwtAuthGuard)
  findAll(@Args('where') where: Prisma.ResourceWhereInput) {
    return this.resourceService.findAll(where);
  }

  @Query('getArchivedResources')
  // @UseGuards(JwtAuthGuard)
  findArchived() {
    return this.resourceService.findArchived();
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
    @Args('uuid') uuid: string,
    @Args('updateResourceInput')
    updateResourceInput: Prisma.ResourceUpdateInput,
  ) {
    return this.resourceService.update(uuid, updateResourceInput);
  }

  @Mutation('removeResource')
  // @UseGuards(JwtAuthGuard)
  remove(@Args('uuid') uuid: string) {
    return this.resourceService.remove({ uuid });
  }

  @Mutation('archiveResource')
  // @UseGuards(JwtAuthGuard, AuthorGuard)
  archive(@Args('uuid') uuid: string) {
    return this.resourceService.archive(uuid);
  }

  @Mutation('unarchiveResource')
  // @UseGuards(JwtAuthGuard, AuthorGuard)
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
