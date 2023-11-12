export interface CreateTodoRequest {
  name: string
  dueDate: string
}

export interface TodoItem {
  userId: string
  todoId: string
  createdAt: string
  name: string
  dueDate: string
  done: boolean
  attachmentUrl?: string
}

export interface TodoUpdate {
  name: string
  dueDate: string
  done: boolean
}

export interface UpdateTodoRequest {
  name: string
  dueDate: string
  done: boolean
}
