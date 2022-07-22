import { gql } from "@apollo/client";

export const programQuery = gql`
  query program($programId: ID!) {
    programs(where: { id: $programId }) {
      id
      metaPtr
    }
  }
`;

export default {};
