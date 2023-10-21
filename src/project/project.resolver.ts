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
import { Board, User } from '@src/types/graphql';
import { ProjectService } from './project.service';
import { JwtAuthGuard } from '@src/auth/jwt-auth.guard';
import { AuthorGuard } from './guards/author.guard';

@Resolver('Project')
export class ProjectResolver {
  constructor(private readonly projectService: ProjectService) {}

  @Mutation('createProject')
  @UseGuards(JwtAuthGuard)
  create(
    @Args('createProjectInput')
    createProjectInput: Prisma.ProjectCreateInput,
  ) {
    return this.projectService.create(createProjectInput);
  }

  @Query('getAllProjects')
  // @UseGuards(JwtAuthGuard)
  findAll(@Args('where') where: Prisma.ProjectWhereInput) {
    return this.projectService.findAll(where);
  }

  @Query('getProject')
  // @UseGuards(JwtAuthGuard)
  findOne(@Args('uuid') uuid: string) {
    return this.projectService.findOne({ uuid });
  }

  @Mutation('updateProject')
  // @UseGuards(JwtAuthGuard, AuthorGuard)
  update(
    @Args('id') id: number,
    @Args('updateProjectInput')
    updateProjectInput: Prisma.ProjectUpdateInput,
  ) {
    return this.projectService.update(id, updateProjectInput);
  }

  @Mutation('removeProject')
  // @UseGuards(JwtAuthGuard, AuthorGuard)
  remove(@Args('id') id: number) {
    return this.projectService.remove({ id });
  }

  // Fields

  @ResolveField(() => User)
  author(@Parent() project) {
    return this.projectService.author(project.authorId);
  }

  @ResolveField(() => [Board])
  boards(@Parent() project) {
    return this.projectService.boards(project.id);
  }
}
