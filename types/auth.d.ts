declare module '#auth-utils' {
  interface User {
    id: string;
    name: string;
    username: string;
    avatar?: string;
  }
}

export {};
