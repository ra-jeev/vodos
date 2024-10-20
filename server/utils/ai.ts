import { runWithTools } from '@cloudflare/ai-utils';

const handleCreateToDo = async (
  userId: string,
  todo: string,
  todoAt?: string
) => {
  console.log('detected todo:', todo, 'time: ', todoAt);
  let todoAtDate: Date | undefined = undefined;
  if (todoAt) {
    todoAtDate = new Date(todoAt);
    if (isNaN(todoAtDate.getTime())) {
      todoAtDate = undefined;
    }
  }

  try {
    await addToDo(userId, todo, todoAtDate);

    return JSON.stringify({ todo, todoAt });
  } catch (error) {
    console.error('Error adding todo:', error);
  }

  return ''
};

export async function handleUserMessage(userId: string, message: string) {
  const messages: { role: 'user' | 'system'; content: string }[] = [
    {
      role: 'system',
      content:
        "You are a helpful personal assistant who manages the Todo list of users. You can use the available tools to help you perform your duties. For add ToDo tasks you'll infer the ToDo that the user wants to add, and if any ToDo date that can be inferred from the user message.",
    },
    {
      role: 'user',
      content: message,
    },
  ];

  const response = await runWithTools(
    hubAI(),
    '@hf/nousresearch/hermes-2-pro-mistral-7b',
    {
      messages,
      tools: [
        {
          name: 'createTodo',
          description: 'Creates a new todo',
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
                  '(Optional) The ude date of the ToDo. Format: YYYY-MM-DD',
              },
            },
            required: ['todo'],
          },
          function: ({ todo, todoAt }) =>
            handleCreateToDo(userId, todo, todoAt),
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
