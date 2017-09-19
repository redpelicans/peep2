import React from 'react';
import PropTypes from 'prop-types';
import styled from 'styled-components';
import { isEmpty } from 'ramda';
import Preview from './Preview';

const ListContainer = styled.div`
  display: grid;
  position:relative;
  grid-template-columns: repeat(auto-fill, minmax(250px,1fr));
  grid-auto-rows: repeat(auto-fill);
  grid-gap: 12px;
`;

export const EmptySearch = styled.span`
  display:flex;
  flex-direction:column;
  justify-content: space-around;
  align-items: center;
  height:70px;
  align-self: center;
  justify-self: center;
  grid-column: left;
  grid-column-start: 1;
  grid-column-end: end;
`;

export const List = ({ companies, ...params }) => (
  <ListContainer>
    {isEmpty(companies) &&
      <EmptySearch>
        <span className="pt-icon-large pt-icon-geosearch" />
        No result...
      </EmptySearch>}
    {companies.map(companie => (
      <Preview key={companie._id} companie={companie} {...params} />
    ))}
  </ListContainer>
);

List.propTypes = {
  companies: PropTypes.array.isRequired,
  filterCompanyList: PropTypes.func.isRequired,
};

export default List;
