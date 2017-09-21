import React from "react";
import PropTypes from "prop-types";
import styled from "styled-components";
import { isEmpty } from "ramda";
import Preview from "./Preview";
import MasonryLayout from "../widgets/MasonryLayout";

const StyledContainer = styled.div`
  display: flex;
  justify-content: center;
`;

export const EmptySearch = styled.span`
  display: flex;
  flex-direction: column;
  justify-content: space-around;
  align-items: center;
  height: 70px;
  align-self: center;
  justify-self: center;
  grid-column: left;
  grid-column-start: 1;
  grid-column-end: end;
`;

const sizes = [
  { columns: 1, gutter: 10 },
  { mq: "800px", columns: 2, gutter: 10 },
  { mq: "1100px", columns: 3, gutter: 10 },
  { mq: "1400px", columns: 4, gutter: 10 },
  { mq: "1700px", columns: 5, gutter: 10 }
];

export const List = ({ people, companies, ...params }) => (
  <StyledContainer>
    {isEmpty(people) ? (
      <EmptySearch>
        <span className="pt-icon-large pt-icon-geosearch" />
        No result...
      </EmptySearch>
    ) : (
      <MasonryLayout id="people" sizes={sizes}>
        {people.map(person => (
          <Preview
            key={person._id}
            person={person}
            company={companies[person.companyId]}
            {...params}
          />
        ))}
      </MasonryLayout>
    )}
  </StyledContainer>
);

List.propTypes = {
  people: PropTypes.array.isRequired,
  companies: PropTypes.object.isRequired,
  onTagClick: PropTypes.func.isRequired,
  deletePeople: PropTypes.func.isRequired
};

export default List;
