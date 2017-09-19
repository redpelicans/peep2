import React from 'react';
import PropTypes from 'prop-types';
 import styled from 'styled-components';
import Preview from './Preview';
import MasonryLayout from 'react-masonry-layout';

const StyledContainer = styled.div`
  display: flex;
  justify-content: center;
`;

const sizes = [
  { columns: 1, gutter: 10 },
  { mq: '800px', columns: 2, gutter: 10 },
  { mq: '1100px', columns: 3, gutter: 10 },
  { mq: '1400px', columns: 4, gutter: 10 },
  { mq: '1700px', columns: 5, gutter: 10 },
];

export const List = ({ companies, ...params }) => (
  <StyledContainer>
    <MasonryLayout
      id="companies"
      sizes={sizes}
    >
      {companies.map(companie => (
        <Preview key={companie._id} companie={companie} {...params} />
      ))}
    </MasonryLayout>
  </StyledContainer>
);

List.propTypes = {
  companies: PropTypes.array.isRequired,
  filterCompanyList: PropTypes.func.isRequired,
};

export default List;
