import {
  Resolver,
  Query,
  Mutation,
  Args,
  ResolveField,
  Parent,
} from '@nestjs/graphql';
import { UseGuards } from '@nestjs/common';
import { Prisma, Project } from '@prisma/client';
import {
  Area,
  Board,
  User,
  Task,
  TasksOrdersInput,
  Resource,
} from '@src/types/graphql';
import { ProjectService } from './project.service';
import { JwtAuthGuard } from '@src/auth/jwt-auth.guard';
import { ProjectAuthorGuard } from './guards/project-author.guard';
import { CurrentUser } from '@src/user/user.decorator';

@Resolver('Project')
export class ProjectResolver {
  constructor(private readonly projectService: ProjectService) {}

  @Mutation('createProject')
  @UseGuards(JwtAuthGuard)
  create(
    @CurrentUser() user: { userId: number },
    @Args('createProjectInput') createProjectInput: Prisma.ProjectCreateInput,
    @Args('areaIds') areaIds: number[],
    @Args('parentId') parentId?: number,
  ) {
    return this.projectService.create({
      data: createProjectInput,
      authorId: user.userId,
      areaIds,
      parentId,
    });
  }

  @Query('getAllProjects')
  @UseGuards(JwtAuthGuard)
  findAll(
    @Args('where') where: Prisma.ProjectWhereInput,
    @CurrentUser() user: { userId: number },
  ) {
    return this.projectService.findAll(where, user.userId);
  }

  @Query('getArchivedProjects')
  @UseGuards(JwtAuthGuard)
  findArchived(@CurrentUser() user: { userId: number }) {
    return this.projectService.findArchived({ authorId: user.userId });
  }

  @Query('getProject')
  @UseGuards(JwtAuthGuard, ProjectAuthorGuard)
  findOne(@Args('uuid') uuid: string, @CurrentUser() user: { userId: number }) {
    return this.projectService.findOne({ uuid, authorId: user.userId });
  }

  @Query('getProjectWhere')
  @UseGuards(JwtAuthGuard)
  findOneWhere(
    @Args('where') where: Prisma.ProjectWhereUniqueInput,
    @CurrentUser() user: { userId: number },
  ) {
    return this.projectService.findOne({ ...where, authorId: user.userId });
  }

  @Mutation('updateProject')
  @UseGuards(JwtAuthGuard, ProjectAuthorGuard)
  update(
    @Args('uuid') uuid: string,
    @Args('updateProjectInput')
    updateProjectInput: Prisma.ProjectUpdateInput,
    @Args('areaIds') areaIds: number[],
  ) {
    return this.projectService.update(uuid, updateProjectInput, areaIds);
  }

  @Mutation('updateProjectTasksOrders')
  @UseGuards(JwtAuthGuard, ProjectAuthorGuard)
  updateTasksOrders(
    @Args('uuid') uuid: string,
    @Args('tasksOrdersInput')
    tasksOrdersInput: TasksOrdersInput[],
  ) {
    return this.projectService.updateTasksOrders(uuid, tasksOrdersInput);
  }

  @Mutation('removeProject')
  @UseGuards(JwtAuthGuard, ProjectAuthorGuard)
  remove(@Args('uuid') uuid: string) {
    return this.projectService.remove({ uuid });
  }

  @Mutation('archiveProject')
  @UseGuards(JwtAuthGuard, ProjectAuthorGuard)
  archive(@Args('uuid') uuid: string) {
    return this.projectService.archive(uuid);
  }

  @Mutation('unarchiveProject')
  @UseGuards(JwtAuthGuard, ProjectAuthorGuard)
  unarchive(@Args('uuid') uuid: string) {
    return this.projectService.unarchive(uuid);
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

  @ResolveField(() => [Resource])
  resources(@Parent() project: Project) {
    return this.projectService.resources(project.id);
  }
}
