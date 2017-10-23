import React from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { map } from 'ramda';
import { Button } from '@blueprintjs/core';
import { withHandlers, compose, withStateHandlers } from 'recompose';
import { bindActionCreators } from 'redux';
import styled from 'styled-components';
import MasonryLayout from '../widgets/MasonryLayout';
import Preview from '../Notes/Preview';
import { getPeople } from '../../selectors/people';
import { getEntityNotes } from '../../selectors/notes';
import { getCompanies } from '../../selectors/companies';
import { getMissions } from '../../selectors/missions';
import ModalNote from '../widgets/ModalNote';
import { addNote, updateNote } from '../../actions/notes';
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
  deleteNote,
  isModalOpen,
  showModal,
  hideModal,
  addNote,
  updateNote,
}) => {
  return (
    <StyledWrapper>
      <ModalNote
        isOpen={isModalOpen}
        title="Add Note"
        reject={() => hideModal()}
        defaultValue=""
        accept={value => {
          hideModal(), addNote(entityId, value, 'person');
        }}
        type="Add"
      />
      <TitleContainer>
        <span>Notes</span>
        <Auth {...getRouteAuthProps('addNote')}>
          <StyledButton
            className="pt-small pt-button"
            iconName="pt-icon-plus"
            onClick={() => showModal()}
          />
        </Auth>
      </TitleContainer>
      <MasonryLayout id="notes" sizes={sizes}>
        {map(
          note => (
            <Preview
              key={note._id}
              note={note}
              person={people[note.authorId]}
              entity={findEntity(entityType, entityId)}
              deleteNote={deleteNote}
              updateNote={updateNote}
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
  deleteNote: PropTypes.func.isRequired,
  showModal: PropTypes.func.isRequired,
  hideModal: PropTypes.func.isRequired,
  isModalOpen: PropTypes.bool.isRequired,
  addNote: PropTypes.func.isRequired,
  updateNote: PropTypes.func.isRequired,
};

const actions = { addNote, updateNote };
const mapDispatchToProps = dispatch => bindActionCreators(actions, dispatch);

const mapStateToProps = (state, { entityId }) => ({
  people: getPeople(state),
  companies: getCompanies(state),
  notes: getEntityNotes(entityId)(state),
  missions: getMissions(state),
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
  withStateHandlers(
    {
      isModalOpen: false,
    },
    {
      showModal: () => () => ({ isModalOpen: true }),
      hideModal: () => () => ({ isModalOpen: false }),
    },
  ),
);

export default enhance(NotesView);
