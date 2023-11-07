import { Dispatch, ReactNode, createContext, useReducer } from "react";
import { BoardAction, boardReducer } from "../reducers";
import { Column } from "../types";

export interface BoardContextType {
  columns: Column[];
}

type BoardDispatchType = Dispatch<BoardAction>;

interface BoardContextProviderProps {
  children: ReactNode;
}

const initialState: BoardContextType = {
  columns: [],
};

const initialDispatchState: BoardDispatchType = () => {};

export const BoardContext = createContext<BoardContextType>(initialState);
export const BoardDispatchContext =
  createContext<BoardDispatchType>(initialDispatchState);

const mainReducer = ({ columns }: BoardContextType, action: BoardAction) => ({
  ...boardReducer({ columns }, action as BoardAction),
});

export const BoardContextProvider = ({
  children,
}: BoardContextProviderProps) => {
  const [state, dispatch] = useReducer(mainReducer, initialState);

  return (
    <BoardContext.Provider value={state}>
      <BoardDispatchContext.Provider value={dispatch}>
        {children}
      </BoardDispatchContext.Provider>
    </BoardContext.Provider>
  );
};
