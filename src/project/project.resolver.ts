import {
  Resolver,
  Query,
  Mutation,
  Args,
  ResolveField,
  Parent,
} from '@nestjs/graphql';
// import { UseGuards } from '@nestjs/common';
import { Prisma, Project } from '@prisma/client';
import { Area, Board, User, Task } from '@src/types/graphql';
import { ProjectService } from './project.service';
// import { JwtAuthGuard } from '@src/auth/jwt-auth.guard';
// import { AuthorGuard } from './guards/author.guard';

@Resolver('Project')
export class ProjectResolver {
  constructor(private readonly projectService: ProjectService) {}

  @Mutation('createProject')
  // @UseGuards(JwtAuthGuard)
  create(
    @Args('createProjectInput') createProjectInput: Prisma.ProjectCreateInput,
    @Args('areaIds') areaIds: number[],
    @Args('parentId') parentId?: number,
  ) {
    return this.projectService.create(createProjectInput, areaIds, parentId);
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

  @Query('getProjectWhere')
  // @UseGuards(JwtAuthGuard)
  findOneWhere(@Args('where') where: Prisma.ProjectWhereUniqueInput) {
    return this.projectService.findOne(where);
  }

  @Mutation('updateProject')
  // @UseGuards(JwtAuthGuard, AuthorGuard)
  update(
    @Args('id') id: number,
    @Args('updateProjectInput')
    updateProjectInput: Prisma.ProjectUpdateInput,
    @Args('areaIds') areaIds: number[],
  ) {
    return this.projectService.update(id, updateProjectInput, areaIds);
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

  @ResolveField(() => [Area])
  areas(@Parent() project) {
    return this.projectService.areas(project.id);
  }

  @ResolveField(() => [Task])
  tasks(@Parent() project) {
    return this.projectService.tasks(project.id);
  }

  @ResolveField(() => [Area])
  subprojects(@Parent() project: Project) {
    return this.projectService.subprojects(project.id);
  }
}
