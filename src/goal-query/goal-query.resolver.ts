import {
  Mutation,
  Resolver,
  Args,
  ResolveField,
  Parent,
} from '@nestjs/graphql';
import { GoalQueryService } from './goal-query.service';
import { OpenAIService } from '@src/openai/openai.service';
import { Project } from '@src/types/graphql';
import {
  HandleGoalQueryInput,
  HandleGoalQueryPayload,
} from '@src/types/graphql';

@Resolver()
export class GoalQueryResolver {
  constructor(
    private readonly goalQueryService: GoalQueryService,
    private openAIService: OpenAIService,
  ) {}

  @Mutation(() => HandleGoalQueryPayload)
  handleGoalQuery(
    @Args('handleGoalQueryInput') handleGoalQueryInput: HandleGoalQueryInput,
  ) {
    return this.goalQueryService.handleGoalQuery(handleGoalQueryInput);
  }

  // Fields
  // @ResolveField(() => Project)
  // project(@Parent() goalQuery) {
  //   return this.applicationService.candidate(application.id);
  // }
}
