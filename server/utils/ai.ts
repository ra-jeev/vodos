import { runWithTools } from '@cloudflare/ai-utils';

const handleCreateToDo = async (
  userId: string,
  todo: string,
  todoAt?: string
) => {
  console.log('detected todo:', todo, 'time: ', todoAt);
  const todoAtDate = getDate(todoAt);

  try {
    await addToDo(userId, todo, todoAtDate);

    return JSON.stringify({ todo, todoAt });
  } catch (error) {
    console.error('Error adding todo:', error);
  }

  return '';
};

const handleGetToDos = async (
  userId: string,
  dueDate?: string,
  completed?: boolean
) => {
  try {
    const todos = await getToDos(userId, {
      dueDate: getDate(dueDate),
      completed,
    });

    return JSON.stringify(todos);
  } catch (error) {
    console.error('Error getting todos:', error);
  }

  return '';
};

export async function handleUserMessage(userId: string, message: string) {
  const messages: { role: 'user' | 'system'; content: string }[] = [
    {
      role: 'system',
      content: `You are a helpful personal assistant who manages the Todo lists of users. Use the available tools to help you perform your duties. For add ToDo tasks infer the ToDo and optionally the due date from user's message. FYI, Today's date is ${
        new Date().toISOString().split('T')[0]
      }`,
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
                  '(Optional) The due date of the ToDo. Format: YYYY-MM-DD.',
              },
            },
            required: ['todo'],
          },
          function: ({ todo, todoAt }) =>
            handleCreateToDo(userId, todo, todoAt),
        },
        {
          name: 'getToDos',
          description: 'Gets todos based on filters (if any)',
          parameters: {
            type: 'object',
            properties: {
              todoAt: {
                type: 'string',
                description:
                  '(Optional) The due date of the ToDo. Format: YYYY-MM-DD.',
              },
              completed: {
                type: 'boolean',
                description: '(Optional) Whether the ToDo is completed or not.',
              },
            },
            required: [],
          },
          function: ({ todoAt, completed }) =>
            handleGetToDos(userId, todoAt, completed),
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
