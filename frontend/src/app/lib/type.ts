export type User = { _id?: string; id?: string; email: string };
export type CreateUserDto = { email: string; password: string };
export type UpdateUserDto = Partial<CreateUserDto>;
export const getUserId = (u: User) => (u.id || u._id)!;

export type Task = {
  _id?: string;
  id?: string;
  title: string;
  description?: string;
  done: boolean;
  dueDate?: string;
};
export type CreateTaskDto = Pick<Task, 'title'|'description'|'dueDate'> & { done?: boolean };
export type UpdateTaskDto = Partial<CreateTaskDto>;
export const getTaskId = (t: Task) => (t.id || t._id)!;
