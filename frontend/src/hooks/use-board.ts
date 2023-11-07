import { BoardContext, BoardDispatchContext } from "../contexts";
import { useContext } from "react";

const useBoard = () => useContext(BoardContext);

const useBoardDispatch = () => useContext(BoardDispatchContext);

export { useBoardDispatch, useBoard };
