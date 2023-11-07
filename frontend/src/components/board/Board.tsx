import { useQuery } from "@apollo/client";
import React, { useCallback, useEffect } from "react";
import {
  DragDropContext,
  DraggableLocation,
  DropResult,
} from "react-beautiful-dnd";
import { GET_CARDS_QUERY } from "../../graphql/queries";
import { useBoard, useBoardDispatch } from "../../hooks";
import { BoardActionType } from "../../reducers";
import { Card, Column as ColumnType } from "../../types";
import Column from "../column/Column";

const Board = (): React.ReactElement => {
  const { loading, error, data } = useQuery(GET_CARDS_QUERY);
  const { columns } = useBoard();
  const dispatch = useBoardDispatch();

  useEffect(() => {
    if (data) {
      const pendingCards = data.cards.filter(
        (x: Card) => x.cardStatus === "PENDING"
      );
      const inProgressCards = data.cards.filter(
        (x: Card) => x.cardStatus === "IN PROGRESS"
      );
      const completedCards = data.cards.filter(
        (x: Card) => x.cardStatus === "COMPLETED"
      );

      const boardData = [
        {
          id: "PENDING",
          title: "PENDING",
          cards: pendingCards,
        },
        {
          id: "IN PROGRESS",
          title: "IN PROGRESS",
          cards: inProgressCards,
        },
        {
          id: "COMPLETED",
          title: "COMPLETED",
          cards: completedCards,
        },
      ];

      dispatch({
        type: BoardActionType.GetColumns,
        payload: { columns: boardData },
      });
    }
  }, [data, dispatch]);

  // Reorder cards in the same list
  const reorder = useCallback(
    (source: DraggableLocation, destination: DraggableLocation) => {
      const updatedCards = columns?.find(
        (x) => x.id === source.droppableId
      )?.cards;

      const [removed] = updatedCards!!.splice(source.index, 1);
      updatedCards!!.splice(destination.index, 0, removed);

      const updatedColumns = columns.map((column) => {
        if (column.id === destination.droppableId) {
          column.cards = updatedCards ?? column.cards;
        }
        return column;
      });

      dispatch({
        type: BoardActionType.GetColumns,
        payload: { columns: updatedColumns },
      });
    },
    [columns, dispatch]
  );

  // Moves an item from one column to another.
  const move = useCallback(
    (
      droppableSource: DraggableLocation,
      droppableDestination: DraggableLocation
    ) => {
      const allColumns = [...(columns ?? [])];

      const source =
        allColumns.find(
          (column) => column.id === droppableSource.droppableId
        ) ?? ({} as ColumnType);
      const destination =
        allColumns.find(
          (column) => column.id === droppableDestination.droppableId
        ) ?? ({} as ColumnType);

      const [removed] = source.cards.splice(droppableSource.index, 1);
      destination.cards.splice(droppableDestination.index, 0, removed);

      const updatedColumns = allColumns.map((column) => {
        if (column.id === source.id) {
          column = source;
        }

        if (column.id === destination.id) {
          column = destination;
        }

        return column;
      });

      dispatch({
        type: BoardActionType.GetColumns,
        payload: { columns: updatedColumns },
      });
    },
    [columns, dispatch]
  );

  const onDragEnd = useCallback(
    (result: DropResult) => {
      console.log("onDragEnd", result);

      const { source, destination } = result;

      // dropped outside the list
      if (!destination) {
        return;
      }
      const sInd = source.droppableId;
      const dInd = destination.droppableId;

      if (sInd === dInd) {
        reorder(source, destination);
      } else {
        move(source, destination);
      }
    },
    [move, reorder]
  );

  if (!data) return <></>;
  if (loading) return <p>Loading...</p>;
  if (error) return <p>Error: {error.message}</p>;

  return (
    <div className="board" style={{ display: "flex" }}>
      <DragDropContext onDragEnd={onDragEnd}>
        {columns?.map((column, idx) => (
          <Column key={column.title} id={column.title} cards={column.cards} />
        ))}
      </DragDropContext>
    </div>
  );
};

export default Board;
