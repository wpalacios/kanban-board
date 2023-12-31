// Column.tsx
import React, { ChangeEvent, useCallback, useState } from "react";
import Card from "../card/Card";
import { Droppable } from "react-beautiful-dnd";
import { ColumnProps } from "./Column.props";
import { useMutation } from "@apollo/client";
import { CREATE_CARD_MUTATION } from "../../graphql/mutations";
import { useBoard, useBoardDispatch } from "../../hooks";
import { BoardActionType } from "../../reducers";

const Column = ({
  id,
  cards,
  defaultWidth = "33vw",
  defaultHeight = "100vh",
}: ColumnProps): React.ReactElement => {
  const { columns } = useBoard();
  const dispatch = useBoardDispatch();
  const [allCards, setCards] = useState(cards);
  const [cardTitle, setCardTitle] = useState<string>("");
  const [createCard] = useMutation(CREATE_CARD_MUTATION);

  const handleAddCard = useCallback(async () => {
    const { data } = await createCard({
      variables: {
        title: cardTitle,
        description: "",
        cardStatus: id,
      },
    });

    const allCols = [...columns];
    const columnIndex = columns.findIndex((x) => x.id === id);
    allCols[columnIndex].cards = [...allCards, { ...data.createCard.card }];
    setCards(allCols[columnIndex].cards);

    dispatch({
      type: BoardActionType.UpdateColumns,
      payload: {
        columns: allCols,
      },
    });
    setCardTitle("");
  }, [allCards, createCard, cardTitle, id, columns, dispatch]);

  const handleChange = useCallback((e: ChangeEvent<HTMLInputElement>) => {
    setCardTitle(e.target.value);
  }, []);

  const handleKeyDown = useCallback(
    (e: React.KeyboardEvent<HTMLInputElement>) => {
      if (!cardTitle) return;

      if (e.key === "Enter") {
        handleAddCard();
      }

      if (e.key === "Escape") {
        setCardTitle("");
      }
    },
    [handleAddCard, cardTitle]
  );

  return (
    <div
      className="flex flex-col bg-slate-100	border border-black rounded-lg p-4 m-4 "
      style={{
        width: defaultWidth,
        minHeight: defaultHeight,
      }}
    >
      <div className="flex justify-between">
        <h3 className="font-bold text-left text-gray-950 tracking-wide ml-4 mt-2">
          {id}
        </h3>
      </div>

      <Droppable droppableId={id}>
        {(provided, snapshot) => (
          <div
            ref={provided.innerRef}
            {...provided.droppableProps}
            className={`${snapshot.isDraggingOver && "bg-blue-100"}`}
          >
            {allCards.map((card, index) => (
              <Card key={card.id} {...card} index={index} />
            ))}
            {provided.placeholder}
            <input
              type="text"
              name="username"
              id="username"
              className="block flex-1 border-0 bg-transparent m-4 py-1.5 pl-1 text-gray-900 placeholder:text-gray-400 focus:ring-0 sm:text-sm sm:leading-6"
              placeholder="Add card..."
              value={cardTitle}
              onKeyDown={handleKeyDown}
              onChange={handleChange}
            />
          </div>
        )}
      </Droppable>
    </div>
  );
};

export default Column;
