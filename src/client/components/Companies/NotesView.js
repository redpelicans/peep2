import React from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import { map, isEmpty } from 'ramda';
import { Button } from '@blueprintjs/core';
import { withHandlers, compose } from 'recompose';
import styled from 'styled-components';
import MasonryLayout from '../widgets/MasonryLayout';
import Preview from '../Notes/Preview';
import { getPeople } from '../../selectors/people';
import { getCompanies } from '../../selectors/companies';
import { getEntityNotes } from '../../selectors/notes';
import { getMissions } from '../../selectors/missions';
import ModalNote from '../widgets/ModalNote';
import { addNote, updateNote, deleteNote } from '../../actions/notes';
import { Auth } from '../../lib/kontrolo';
import { getRouteAuthProps } from '../../routes';

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

const StyledButton = styled(Button)`
  margin-left: 10px;
  width: 35px;
`;

const TitleContainer = styled.div`
  display: flex;
  align-items: center;
  margin-top: 10px;
  margin-bottom: 20px;
`;

const NotesView = ({
  findEntity,
  notes,
  people,
  entityType,
  entityId,
  hasBackdrop,
  hideModal,
  addNote,
  updateNote,
  deleteNote,
}) => {
  // if (notes === null || isEmpty(notes)) return null;
  return (
    <StyledWrapper>
      <ModalNote
        isOpen={hasBackdrop}
        title="Add Note"
        reject={() => hideModal()}
        defaultValue=""
        accept={value => {
          hideModal(), addNote(entityId, value, 'company');
        }}
        type="Add"
      />
      {!isEmpty(notes) && (
        <TitleContainer>
          <span>Notes</span>
        </TitleContainer>
      )}
      <MasonryLayout id="entityNotes" sizes={sizes}>
        {map(
          note => (
            <Preview
              key={note._id}
              note={note}
              person={people[note.authorId]}
              entity={findEntity(entityType, entityId)}
              updateNote={updateNote}
              deleteNote={deleteNote}
            />
          ),
          notes,
        )}
      </MasonryLayout>
    </StyledWrapper>
  );
};

NotesView.propTypes = {
  notes: PropTypes.array,
  people: PropTypes.object,
  companies: PropTypes.object,
  entityId: PropTypes.string,
  entityType: PropTypes.string,
  findEntity: PropTypes.func.isRequired,
  hideModal: PropTypes.func.isRequired,
  hasBackdrop: PropTypes.bool.isRequired,
  addNote: PropTypes.func.isRequired,
  updateNote: PropTypes.func.isRequired,
  deleteNote: PropTypes.func.isRequired,
};

const actions = { addNote, updateNote, deleteNote };
const mapDispatchToProps = dispatch => bindActionCreators(actions, dispatch);

const mapStateToProps = (state, { entityId }) => ({
  notes: getEntityNotes(entityId)(state),
  people: getPeople(state),
  missions: getMissions(state),
  companies: getCompanies(state),
});

const enhance = compose(
  connect(mapStateToProps, mapDispatchToProps),
  withHandlers({
    findEntity: ({ companies, people, missions }) => (entityType, entityId) => {
      if (!people || !companies || !missions) return null;
      const getEntity = (entityType, entityId) => {
        switch (entityType) {
          case 'person':
            return people[entityId];
          case 'company':
            return companies[entityId];
          case 'mission':
            return missions[entityId];
          default:
            return null;
        }
      };
      const entity = getEntity(entityType, entityId);
      return entity ? entity : {}; // eslint-disable-line no-unneeded-ternary
    },
  }),
);

export default enhance(NotesView);
