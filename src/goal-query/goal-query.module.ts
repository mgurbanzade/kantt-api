import { Module } from '@nestjs/common';
import { GoalQueryService } from './goal-query.service';
import { GoalQueryResolver } from './goal-query.resolver';
import { OpenAIService } from '@src/openai/openai.service';
import { ProjectService } from '@src/project/project.service';
import { BoardService } from '@src/board/board.service';
import { ColumnService } from '@src/column/column.service';
import { TaskService } from '@src/task/task.service';

@Module({
  providers: [
    GoalQueryResolver,
    GoalQueryService,
    ProjectService,
    BoardService,
    ColumnService,
    TaskService,
    OpenAIService,
  ],
})
export class GoalQueryModule {}
