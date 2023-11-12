import TodosAccess from '../data-access/todosAccess'
import { TodosStorage } from '../data-access/todosStorage'

const todosAccess = new TodosAccess()
const todosStorage = new TodosStorage()

export async function updateAttachmentUrl(
  userId: string,
  todoId: string,
  attachmentId: string
) {
  const attachmentUrl = await todosStorage.getAttachmentUrl(attachmentId)

  const item = await todosAccess.getTodoItem(todoId)

  if (!item) throw new Error('Item not found')

  if (item.userId !== userId) {
    throw new Error('User is not authorized to update item')
  }

  await todosAccess.updateAttachmentUrl(todoId, attachmentUrl)
}

export async function generateUploadUrl(attachmentId: string): Promise<string> {
  const uploadUrl = await todosStorage.getUploadUrl(attachmentId)

  return uploadUrl
}
