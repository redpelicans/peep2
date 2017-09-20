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

export const List = ({ companies, ...params }) => (
  <StyledContainer>
    <MasonryLayout id="companies" sizes={sizes}>
      {isEmpty(companies) && (
        <EmptySearch>
          <span className="pt-icon-large pt-icon-geosearch" />
          No result...
        </EmptySearch>
      )}
      {companies.map(companie => (
        <Preview key={companie._id} companie={companie} {...params} />
      ))}
    </MasonryLayout>
  </StyledContainer>
);

List.propTypes = {
  companies: PropTypes.array.isRequired,
  filterCompanyList: PropTypes.func.isRequired
};

export default List;
