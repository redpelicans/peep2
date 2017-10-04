import React from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { map, isEmpty } from 'ramda';
import { withHandlers, compose } from 'recompose';
import styled from 'styled-components';
import MasonryLayout from '../widgets/MasonryLayout';
import Preview from '../Notes/Preview';
import { getPeople, getPersonNotes } from '../../selectors/people';
import { getCompanies } from '../../selectors/companies';

const sizes = [
  { columns: 1, gutter: 10 },
  { mq: '800px', columns: 2, gutter: 10 },
  { mq: '1100px', columns: 3, gutter: 10 },
  { mq: '1400px', columns: 4, gutter: 10 },
  { mq: '1700px', columns: 5, gutter: 10 },
];

const StyledWrapper = styled.div`
  display: flex;
  flex-direction: column;
  flex-wrap: wrap;
`;

const StyledLabel = styled.span`
  margin-bottom: 10px;
`;

const NotesView = ({ findEntity, notes, people, entityType, entityId }) => {
  if (isEmpty(notes)) return null;
  return (
    <StyledWrapper>
        <StyledLabel>Notes</StyledLabel>
        <MasonryLayout id="notes" sizes={sizes}>
        {map(note =>
          <Preview
            key={note._id}
            note={note}
            person={people[note.authorId]}
            entity={findEntity(entityType, entityId)}
          />, notes)
        }
        </MasonryLayout>
    </StyledWrapper>
  )
};

NotesView.propTypes = {
  notes: PropTypes.array,
  people: PropTypes.object,
  companies: PropTypes.object,
  entityId: PropTypes.string,
  entityType: PropTypes.string,
  findEntity: PropTypes.func.isRequired,
};

const mapStateToProps = (state, props) => ({
  people: getPeople(state),
  companies: getCompanies(state),
  notes: getPersonNotes(state, props),
});

const enhance = compose(
  connect(mapStateToProps),
  withHandlers({
    findEntity: ({ companies, people }) => (entityType, entityId) => {
      if (!people || !companies) return null;
      const entity =
        entityType === 'person' ? people[entityId] : companies[entityId];
      return entity ? entity : {}; // eslint-disable-line no-unneeded-ternary
    },
  }),
);

export default enhance(NotesView);
