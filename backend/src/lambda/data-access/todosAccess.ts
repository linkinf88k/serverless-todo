import * as AWS from 'aws-sdk'

import { DocumentClient } from 'aws-sdk/clients/dynamodb'
import { TodoItem, TodoUpdate } from '../interfaces'

const AWSXRay = require('aws-xray-sdk')
const XAWS = AWSXRay.captureAWS(AWS)

export default class TodosAccess {
  constructor(
    private readonly docClient: DocumentClient = new XAWS.DynamoDB.DocumentClient(),
    private readonly todosTable = process.env.TODOS_TABLE ?? 'Todos-dev',
    private readonly todosByUserIndex = process.env.TODOS_CREATED_AT_INDEX ??
      'CreatedAtIndex'
  ) {}

  async getTodoItems(userId: string): Promise<TodoItem[]> {
    const result = await this.docClient
      .query({
        TableName: this.todosTable,
        IndexName: this.todosByUserIndex,
        KeyConditionExpression: 'userId = :userId',
        ExpressionAttributeValues: {
          ':userId': userId
        }
      })
      .promise()

    const items = result.Items

    return items as TodoItem[]
  }

  async createTodoItem(todoItem: TodoItem) {
    await this.docClient
      .put({
        TableName: this.todosTable,
        Item: todoItem
      })
      .promise()
  }

  async updateTodoItem(todoId: string, todoUpdate: TodoUpdate) {
    await this.docClient
      .update({
        TableName: this.todosTable,
        Key: {
          todoId
        },
        UpdateExpression: 'set #name = :name, dueDate = :dueDate, done = :done',
        ExpressionAttributeNames: {
          '#name': 'name'
        },
        ExpressionAttributeValues: {
          ':name': todoUpdate.name,
          ':dueDate': todoUpdate.dueDate,
          ':done': todoUpdate.done
        }
      })
      .promise()
  }

  async getTodoItem(todoId: string): Promise<TodoItem> {
    const result = await this.docClient
      .get({
        TableName: this.todosTable,
        Key: {
          todoId
        }
      })
      .promise()

    const item = result.Item

    return item as TodoItem
  }

  async deleteTodoItem(todoId: string) {
    await this.docClient
      .delete({
        TableName: this.todosTable,
        Key: {
          todoId
        }
      })
      .promise()
  }

  async updateAttachmentUrl(todoId: string, attachmentUrl: string) {
    await this.docClient
      .update({
        TableName: this.todosTable,
        Key: {
          todoId
        },
        UpdateExpression: 'set attachmentUrl = :attachmentUrl',
        ExpressionAttributeValues: {
          ':attachmentUrl': attachmentUrl
        }
      })
      .promise()
  }
}
