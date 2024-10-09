import { runWithTools } from '@cloudflare/ai-utils';

export async function handleUserRequest(message: string) {
  const messages: { role: 'user' | 'system'; content: string }[] = [
    {
      role: 'user',
      content: message,
    },
  ];

  messages.unshift({
    role: 'system',
    content:
      "You are a helpful personal assistant who manages the Todo list of users. You can use the available tools to help you perform your duties. For add ToDo tasks you'll infer the ToDo that the user wants to add, and if any ToDo date that can be inferred from the user message.",
  });

  const response = await runWithTools(
    hubAI(),
    '@hf/nousresearch/hermes-2-pro-mistral-7b',
    {
      messages,
      tools: [
        {
          name: 'createTodo',
          description: 'Creates a new todo/task',
          parameters: {
            type: 'object',
            properties: {
              todo: {
                type: 'string',
                description: 'The task that the user wants to add',
              },
              todoAt: {
                type: 'string',
                description:
                  '(Optional) The date to which the user wants to add this ToDo to. Format: YYYY-MM-DD',
              },
            },
            required: ['todo'],
          },
          function: async ({ todo, todoAt }) => {
            console.log('detected todo:', todo, 'time: ', todoAt);
            return JSON.stringify({ todo, todoAt });
          },
        },
      ],
    },
    {
      streamFinalResponse: true,
      verbose: true,
    }
  );

  return response;
}
