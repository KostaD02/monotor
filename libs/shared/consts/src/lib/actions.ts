import { Action, ActionTypes } from '@fitmonitor/interfaces';

export const CREATE_ACTION_BUTTON: Action = {
  label: 'Create',
  type: ActionTypes.Create,
};

export const UPDATE_ACTION_BUTTON: Action = {
  label: 'Update',
  type: ActionTypes.Update,
};

export const DELETE_ACTION_BUTTON: Action = {
  label: 'Delete',
  type: ActionTypes.Delete,
};

export const DELETE_ALL_ACTION_BUTTON: Action = {
  label: 'Delete All',
  type: ActionTypes.DeleteAll,
};

export const ACTIONS = [
  CREATE_ACTION_BUTTON,
  UPDATE_ACTION_BUTTON,
  DELETE_ACTION_BUTTON,
  DELETE_ALL_ACTION_BUTTON,
];
