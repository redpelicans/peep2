import React from 'react';
import PropTypes from 'prop-types';
import styled from 'styled-components';
import { isEmpty } from 'ramda';
import Preview from './Preview';
import { EmptySearch } from '../widgets';
import MasonryLayout from '../widgets/MasonryLayout';

const StyledContainer = styled.div`
  display: flex;
  justify-content: center;
`;

const sizes = [
  { columns: 1, gutter: 10 },
  { mq: '700px', columns: 2, gutter: 10 },
  { mq: '1000px', columns: 3, gutter: 10 },
  { mq: '1300px', columns: 4, gutter: 10 },
  { mq: '1600px', columns: 5, gutter: 10 },
  { mq: '1900px', columns: 6, gutter: 10 },
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
  deletePeople: PropTypes.func.isRequired,
  onTagClick: PropTypes.func.isRequired,
};

export default List;
