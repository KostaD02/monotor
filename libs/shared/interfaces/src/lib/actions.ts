export enum ActionTypes {
  Create = 'create',
  Update = 'update',
  Delete = 'delete',
  DeleteAll = 'deleteAll',
}

export interface Action {
  label: string;
  type: ActionTypes;
}
