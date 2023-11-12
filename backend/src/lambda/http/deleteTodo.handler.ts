import TodosAccess from '../data-access/todosAccess'

const todosAccess = new TodosAccess()

export async function deleteTodo(userId: string, todoId: string) {
  const item = await todosAccess.getTodoItem(todoId)

  if (!item) throw new Error('Item not found')

  if (item.userId !== userId) {
    throw new Error('User is not authorized to delete item')
  }

  todosAccess.deleteTodoItem(todoId)
}
