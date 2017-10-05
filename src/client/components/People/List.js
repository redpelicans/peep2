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
  { mq: '750px', columns: 2, gutter: 10 },
  { mq: '1025px', columns: 3, gutter: 10 },
  { mq: '1325px', columns: 4, gutter: 10 },
  { mq: '1625px', columns: 5, gutter: 10 },
  { mq: '1925px', columns: 6, gutter: 10 },
  { mq: '2225px', columns: 7, gutter: 10 },
  { mq: '2535px', columns: 8, gutter: 10 },
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
