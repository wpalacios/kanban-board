import { gql } from "@apollo/client";

export const GET_CARDS_QUERY = gql`
  query getAllCards {
    cards {
      id
      title
      description
      cardStatus
      createdAt
      updatedAt
    }
  }
`;
