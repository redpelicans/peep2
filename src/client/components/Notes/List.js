import React from 'react';
import PropTypes from 'prop-types';
import styled from 'styled-components';
import { isEmpty } from 'ramda';
import { withHandlers } from 'recompose';
import Preview from './Preview';
import { EmptySearch } from '../widgets';
import MasonryLayout from '../widgets/MasonryLayout';

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

export const List = ({ notes, people, findEntity }) => (
  <StyledContainer>
    {isEmpty(notes) ? (
      <EmptySearch>
        <span className="pt-icon-large pt-icon-geosearch" />
        No result...
      </EmptySearch>
    ) : (
      <MasonryLayout id="notes" sizes={sizes}>
        {notes.map(note => (
          <Preview
            key={note._id}
            note={note}
            people={people}
            entity={findEntity(note.entityType, note.entityId)}
          />
        ))}
      </MasonryLayout>
    )}
  </StyledContainer>
);

List.propTypes = {
  notes: PropTypes.array.isRequired,
  people: PropTypes.object.isRequired,
  companies: PropTypes.object.isRequired,
  findEntity: PropTypes.func.isRequired,
};

const enhance = withHandlers({
  findEntity: ({ companies, people }) => (entityType, entityId) => {
    const entity =
      entityType === 'person' ? people[entityId] : companies[entityId];
    return entity ? entity : {}; // eslint-disable-line no-unneeded-ternary
  },
});

export default enhance(List);
