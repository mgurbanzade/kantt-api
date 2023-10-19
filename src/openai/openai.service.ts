import { Injectable } from '@nestjs/common';
import OpenAI from 'openai';

const openai = new OpenAI({
  apiKey: process.env['OPEN_AI_API_KEY'],
});

@Injectable()
export class OpenAIService {
  constructor() {}

  async sendQuery(query: string) {
    const chatCompletion = await openai.chat.completions.create({
      messages: [
        {
          role: 'system',
          content: `The following prompt is a user query you need to process. 
             The response should be a list of micro steps to take to achive the goal user wants to achieve. 
             Please ignore the input if it is not about achieving some goal. 
             Because the system should create a kanban board with tasks, depending on the steps you will provide. 
             If you think user asks for random things and it is not possible to create micro tasks out of the user input. 
             Just return "Request is not processible. 
             It will be used to name the board. 
             The project should have a title and each task should have a title and a description. 
             Return the response in the following format:
               Project: <project title>
               <task title> | <task description>
             Each task with description should be a single string.
             Don't use any prefixes like "Task: " or "Step: or <number>: ".
            `,
        },
        { role: 'user', content: query },
      ],
      model: 'gpt-4',
    });

    return chatCompletion;
  }
}
