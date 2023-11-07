import { gql } from "@apollo/client";

export const CREATE_CARD_MUTATION = gql`
  mutation createCardItem(
    $title: String
    $description: String
    $cardStatus: String
  ) {
    createCard(
      title: $title
      description: $description
      cardStatus: $cardStatus
    ) {
      card {
        id
        title
        description
        cardStatus
        createdAt
        updatedAt
      }
    }
  }
`;

export const UPDATE_CARD_MUTATION = gql`
  mutation updateCardItem(
    $id: ID
    $title: String
    $description: String
    $cardStatus: String
  ) {
    updateCard(
      id: $id
      title: $title
      description: $description
      cardStatus: $cardStatus
    ) {
      card {
        id
        title
        description
        cardStatus
        createdAt
        updatedAt
      }
    }
  }
`;

export const DELETE_CARD_MUTATION = gql`
  mutation deleteCardItem($id: ID) {
    deleteCard(id: $id) {
      success
    }
  }
`;
