import { ActionMap, Column } from "../../types";

export enum BoardActionType {
  GetColumns = "GET_COLUMNS",
  UpdateColumns = "UPDATE_COLUMNS"
}

export interface BoardReducerState {
  columns: Column[];
}

interface BoardReducerPayload {
  [BoardActionType.GetColumns]: {
    columns: Column[];
  };
  [BoardActionType.UpdateColumns]: {
    columns: Column[];
  };
}

export type BoardAction =
  ActionMap<BoardReducerPayload>[keyof ActionMap<BoardReducerPayload>];

export const boardReducer = (
  state: BoardReducerState,
  action: BoardAction
): BoardReducerState => {
  switch (action.type) {
    case BoardActionType.GetColumns: {
      return {
        columns: [...action.payload.columns],
      };
    }
    case BoardActionType.UpdateColumns: {
      return {
        columns: action.payload.columns,
      };
    }
    default:
      return state;
  }
};
