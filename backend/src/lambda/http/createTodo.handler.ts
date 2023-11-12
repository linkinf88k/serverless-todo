import { APIGatewayProxyEvent } from 'aws-lambda'
import { CreateTodoRequest, TodoItem } from '../interfaces'
import * as uuid from 'uuid'
import { getUserId } from '../utils'
import TodosAccess from '../data-access/todosAccess'

const todosAccess = new TodosAccess()

export async function createTodo(
  event: APIGatewayProxyEvent,
  createTodoRequest: CreateTodoRequest
): Promise<TodoItem> {
  const todoId = uuid.v4()
  const userId = getUserId(event)
  const createdAt = new Date(Date.now()).toISOString()

  const todoItem = {
    userId,
    todoId,
    createdAt,
    done: false,
    //attachmentUrl: `https://${todosStorage.getBucketName()}.s3-eu-west-1.amazonaws.com/images/${todoId}.png`,
    ...createTodoRequest
  }

  await todosAccess.createTodoItem(todoItem)

  return todoItem
}
