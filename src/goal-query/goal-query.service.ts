import { Injectable } from '@nestjs/common';
import { OpenAIService } from '@src/openai/openai.service';
import { ProjectService } from '@src/project/project.service';
import { BoardService } from '@src/board/board.service';
import { ColumnService } from '@src/column/column.service';
import { TaskService } from '@src/task/task.service';
import { v4 as uuidv4 } from 'uuid';
import { HandleGoalQueryInput } from '@src/types/graphql';

@Injectable()
export class GoalQueryService {
  constructor(
    private openAIService: OpenAIService,
    private projectService: ProjectService,
    private boardService: BoardService,
    private columnService: ColumnService,
    private taskService: TaskService,
  ) {}

  async handleGoalQuery(
    handleGoalQueryInput: HandleGoalQueryInput,
  ): Promise<any> {
    const { body } = handleGoalQueryInput;

    const response = await this.openAIService.sendQuery(body);

    if (
      response.choices[0].message.content.includes('Request is not processible')
    ) {
      return {
        success: false,
        goal: '',
        tasks: [],
      };
    } else {
      const responseText = response.choices[0].message.content;
      const responseTextArray = responseText.split('\n');
      const projectTitle = responseTextArray[0].replace('Project: ', '');
      const microSteps = responseTextArray
        .slice(1)
        .filter((str) => str.length > 0);

      console.log(responseTextArray);

      const project = await this.projectService.create(
        {
          uuid: uuidv4(),
          title: projectTitle,
          description: projectTitle,
          isArchived: false,
          progress: 0,
        },
        [],
        null,
      );

      const board = await this.boardService.create(
        {
          uuid: uuidv4(),
          title: projectTitle,
          description: projectTitle,
          isArchived: false,
          project: {
            connect: {
              id: project.id,
            },
          },
          columns: {
            createMany: {
              data: [
                {
                  title: 'To do',
                },
                {
                  title: 'In progress',
                },
                {
                  title: 'Done',
                },
              ],
            },
          },
        },
        project?.id,
      );

      const columnId = board.columns[0].id;
      const tasksFromOpenAi = microSteps.map((microStep, idx) => ({
        uuid: uuidv4(),
        title: microStep.split('|')[0].replace('Task ', '').trim(),
        description: microStep.split('|')[1].trim(),
        boardId: board.id,
        order: parseFloat(Number(idx + 1).toFixed(1)),
        columnId,
      }));

      await this.taskService.createMany(tasksFromOpenAi);

      return {
        success: true,
        project,
      };
    }
  }

  // Fields
  // project(handleGoalQueryPayload: HandleGoalQueryPayload) {
  //   return this.projectService.findOne({
  //     id: handleGoalQueryPayload.project.id,
  //   });
  // }
}
