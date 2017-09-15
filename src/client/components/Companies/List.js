import React, { PropTypes } from 'react';
import styled from 'styled-components';
import Preview from './Preview';

const ListContainer = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(250px,1fr));
  grid-template-rows: repeat(auto-fill, 100px);
  grid-gap: 10px;
`;

export const List = ({ companies, ...params }) => (
  <ListContainer>
    {console.log('params: ', params)}
    { companies.map(companie => (
      <Preview key={companie._id} companie={companie} />
    ))}
  </ListContainer>
);

List.propTypes = {
  companies: PropTypes.array.isRequired,
  filterCompanyList: PropTypes.func.isRequired,
  togglePreferred: PropTypes.func.isRequired,
};

export default List;
