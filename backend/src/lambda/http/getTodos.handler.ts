import { APIGatewayProxyEvent } from 'aws-lambda'
import TodosAccess from '../data-access/todosAccess'
import { getUserId } from '../utils.js'

const todosAccess = new TodosAccess()

export async function getTodos(event: APIGatewayProxyEvent) {
  const userId = getUserId(event)

  return await todosAccess.getTodoItems(userId)
}
