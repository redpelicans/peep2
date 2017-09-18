import React from 'react';
import PropTypes from 'prop-types';
import styled from 'styled-components';
import Preview from './Preview';

const ListContainer = styled.div`
  display: grid;
  position:relative;
  grid-template-columns: repeat(auto-fill, minmax(250px,1fr));
  grid-auto-rows: repeat(auto-fill);
  grid-gap: 12px;
`;

export const List = ({ companies, ...params }) => (
  <ListContainer>
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
