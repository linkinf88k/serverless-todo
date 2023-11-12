import { APIGatewayProxyEvent } from 'aws-lambda'
import TodosAccess from '../data-access/todosAccess'
import { getUserId } from '../utils.js'
import { TodoUpdate, UpdateTodoRequest } from '../interfaces'

const todosAccess = new TodosAccess()

export async function updateTodo(
  userId: string,
  todoId: string,
  updateTodoRequest: UpdateTodoRequest
) {
  const item = await todosAccess.getTodoItem(todoId)

  if (!item) throw new Error('Item not found')

  if (item.userId !== userId) {
    throw new Error('User is not authorized to update item')
  }

  todosAccess.updateTodoItem(todoId, updateTodoRequest as TodoUpdate)
}
