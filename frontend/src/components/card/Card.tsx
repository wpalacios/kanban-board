// Card.tsx
import { useMutation } from "@apollo/client";
import React, { ChangeEvent, useCallback, useRef, useState } from "react";
import { Draggable } from "react-beautiful-dnd";
import {
  DELETE_CARD_MUTATION,
  UPDATE_CARD_MUTATION,
} from "../../graphql/mutations";
import { CardProps } from "./Card.props";

const Card = ({
  id,
  title,
  description,
  index,
  cardStatus,
}: CardProps): React.ReactElement => {
  const [updateCard] = useMutation(UPDATE_CARD_MUTATION);
  const [deleteCard] = useMutation(DELETE_CARD_MUTATION);
  const [cardTitle, setCardTitle] = useState<string>(title);
  const [editing, setEditing] = useState<boolean>(false);
  const [deleted, setDeleted] = useState<boolean>(false);
  const inputRef = useRef<HTMLInputElement>(null);

  const handleUpdateCard = useCallback(async () => {
    const { data } = await updateCard({
      variables: {
        id,
        title: cardTitle,
        description: "",
        cardStatus,
      },
    });

    console.log(data.updateCard.card);
    setEditing(false);
  }, [updateCard, id, cardTitle, cardStatus]);

  const handleEditClick = useCallback(() => {
    setEditing(!editing);
    if (inputRef.current) {
      inputRef.current.focus();
    }
  }, [editing]);

  const handleDelete = useCallback(async () => {
    const { data } = await deleteCard({
      variables: {
        id,
      },
    });

    console.log(data.deleteCard.success);
    setEditing(false);
    data.deleteCard.success && setDeleted(true);
  }, []);

  const handleChange = useCallback((e: ChangeEvent<HTMLInputElement>) => {
    setCardTitle(e.target.value);
  }, []);

  const handleKeyDown = useCallback(
    (e: React.KeyboardEvent<HTMLInputElement>) => {
      if (e.key === "Enter") {
        handleUpdateCard();
      }

      if (e.key === "Escape") {
        setEditing(false);
      }
    },
    [handleUpdateCard]
  );

  if (deleted) return <></>;

  return (
    <Draggable draggableId={id} index={index}>
      {(provided, snapshot) => (
        <div
          ref={provided.innerRef}
          className={`card m-4 bg-white ${
            snapshot.isDragging && "bg-blue-200"
          }`}
          {...provided.draggableProps}
          {...provided.dragHandleProps}
        >
          <div className="border border-black rounded-lg p-4">
            <div className="flex justify-between">
              {editing && (
                <input
                  type="text"
                  name="username"
                  id="username"
                  className="block flex-1 border-0 bg-transparent py-1.5 pl-1 text-gray-900 placeholder:text-gray-400 focus:ring-0 sm:text-sm sm:leading-6"
                  placeholder="Card title"
                  value={cardTitle}
                  onKeyDown={handleKeyDown}
                  onChange={handleChange}
                />
              )}
              {!editing && (
                <h4 className="font-medium leading-tight text-neutral-800 capitalize">
                  {cardTitle}
                </h4>
              )}
              <div className="flex flex-row">
                <button
                  type="button"
                  className="inline-flex w-full justify-center gap-x-1.5 rounded-md bg-white px-3 py-2 text-sm font-semibold text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 hover:bg-gray-50"
                  id="menu-edit"
                  aria-expanded="false"
                  aria-haspopup="true"
                  onClick={handleEditClick}
                >
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    fill="none"
                    viewBox="0 0 24 24"
                    strokeWidth={1.5}
                    stroke="currentColor"
                    className="w-6 h-6"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      d="M16.862 4.487l1.687-1.688a1.875 1.875 0 112.652 2.652L10.582 16.07a4.5 4.5 0 01-1.897 1.13L6 18l.8-2.685a4.5 4.5 0 011.13-1.897l8.932-8.931zm0 0L19.5 7.125M18 14v4.75A2.25 2.25 0 0115.75 21H5.25A2.25 2.25 0 013 18.75V8.25A2.25 2.25 0 015.25 6H10"
                    />
                  </svg>
                </button>
                <button
                  type="button"
                  className="inline-flex w-full justify-center gap-x-1.5 rounded-md bg-white px-3 py-2 text-sm font-semibold text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 hover:bg-gray-50"
                  id="menu-delete"
                  aria-expanded="false"
                  aria-haspopup="true"
                  onClick={handleDelete}
                >
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    fill="none"
                    viewBox="0 0 24 24"
                    strokeWidth={1.5}
                    stroke="currentColor"
                    className="w-6 h-6"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      d="M14.74 9l-.346 9m-4.788 0L9.26 9m9.968-3.21c.342.052.682.107 1.022.166m-1.022-.165L18.16 19.673a2.25 2.25 0 01-2.244 2.077H8.084a2.25 2.25 0 01-2.244-2.077L4.772 5.79m14.456 0a48.108 48.108 0 00-3.478-.397m-12 .562c.34-.059.68-.114 1.022-.165m0 0a48.11 48.11 0 013.478-.397m7.5 0v-.916c0-1.18-.91-2.164-2.09-2.201a51.964 51.964 0 00-3.32 0c-1.18.037-2.09 1.022-2.09 2.201v.916m7.5 0a48.667 48.667 0 00-7.5 0"
                    />
                  </svg>
                </button>
              </div>
            </div>
            {/* <p className="mb-4 text-base text-neutral-600 ">{description}</p> */}
          </div>
        </div>
      )}
    </Draggable>
  );
};

export default Card;
