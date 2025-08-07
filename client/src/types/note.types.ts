export type Block = {
  id: string
  content: string
}

export enum ActionType {
  CREATE = 'create',
  UPDATE = 'update',
  DELETE = 'delete',
}

export type Action = {
  type: ActionType
  payload: Partial<Block>
}

export interface Note {
  id: string
  blocks: Block[]
  isFavorite: boolean
  space?: string
}
