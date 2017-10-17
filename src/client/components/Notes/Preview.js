import React from 'react';
import PropTypes from 'prop-types';
import styled from 'styled-components';
import { withStateHandlers } from 'recompose';
import Footer from './Footer';
import { MarkdownConvertor } from '../widgets/Markdown';
import { Button } from '@blueprintjs/core';
import ModalNote from '../widgets/ModalNote';
import { PreviewContainer, Actions, ModalConfirmation } from '../widgets';
import { Auth } from '../../lib/kontrolo';
import { getRouteAuthProps } from '../../routes';

const StyledButton = styled(Button)`
  margin-right: 5px;
  margin-top: 5px;
`;

export const StyledNoteWrap = styled.div`
  margin: 0 auto;
  width: 90%;
`;

export const StyledFooterLine = styled.hr`
  margin-top: 10px;
  margin-bottom: 10px;
`;

export const Icons = styled.div`
  margin-left: 5px;
  margin-right: 5px;
  color: rgb(68, 86, 99);
`;

const StyledMarkdownConvertor = styled(MarkdownConvertor)`overflow: hidden;`;

export const CardContent = ({ note, person, entity }) => (
  <div>
    <StyledMarkdownConvertor>{note.content}</StyledMarkdownConvertor>
    <StyledFooterLine />
    <Footer note={note} person={person} entity={entity} />
  </div>
);

CardContent.propTypes = {
  note: PropTypes.object.isRequired,
  person: PropTypes.object,
  entity: PropTypes.object,
};

export const Preview = ({
  handleMouseEnter,
  handleMouseLeave,
  showActions,
  note,
  person,
  entity,
  showDialog,
  hideDialog,
  isDeleteDialogOpen,
  deleteNote,
  isModalOpen,
  showModal,
  hideModal,
  updateNote,
}) => (
  <PreviewContainer
    className="pt-card pt-elevation-0 pt-interactive"
    onMouseOver={handleMouseEnter}
    onMouseEnter={handleMouseEnter}
    onMouseLeave={handleMouseLeave}
    showActions={showActions}
  >
    <ModalNote
      isOpen={isModalOpen}
      title="Update Note"
      value={note.content}
      reject={() => hideModal()}
      defaultValue={note.content}
      accept={value => {
        hideModal();
        updateNote(note._id, value, 'person');
      }}
      type="Update"
    />
    <ModalConfirmation
      isOpen={isDeleteDialogOpen}
      title="Would you like to delete this note?"
      reject={() => hideDialog()}
      accept={() => deleteNote(note._id)}
    />
    {showActions && (
      <Actions>
        <Auth {...getRouteAuthProps('editNote')} context={{ note }}>
          <StyledButton
            className="pt-small pt-button pt-intent-warning"
            iconName="pt-icon-edit"
            onClick={() => showModal()}
          />
        </Auth>
        <Auth {...getRouteAuthProps('deleteNote')} context={{ note }}>
          <StyledButton
            className="pt-small pt-button pt-intent-danger"
            iconName="pt-icon-trash"
            onClick={() => showDialog()}
          />
        </Auth>
      </Actions>
    )}
    <CardContent note={note} person={person} entity={entity} />
  </PreviewContainer>
);

Preview.propTypes = {
  note: PropTypes.object,
  person: PropTypes.object,
  entity: PropTypes.object,
  showActions: PropTypes.bool.isRequired,
  handleMouseEnter: PropTypes.func.isRequired,
  handleMouseLeave: PropTypes.func.isRequired,
  showDialog: PropTypes.func.isRequired,
  hideDialog: PropTypes.func.isRequired,
  isDeleteDialogOpen: PropTypes.bool.isRequired,
  deleteNote: PropTypes.func.isRequired,
  showModal: PropTypes.func.isRequired,
  hideModal: PropTypes.func.isRequired,
  isModalOpen: PropTypes.bool.isRequired,
  updateNote: PropTypes.func.isRequired,
};

const enhance = withStateHandlers(
  {
    showActions: false,
    isDeleteDialogOpen: false,
    isModalOpen: false,
  },
  {
    handleMouseLeave: () => () => ({ showActions: false }),
    handleMouseEnter: () => () => ({ showActions: true }),
    showDialog: () => () => ({ isDeleteDialogOpen: true }),
    hideDialog: () => () => ({ isDeleteDialogOpen: false }),
    showModal: () => () => ({ isModalOpen: true }),
    hideModal: () => () => ({ isModalOpen: false }),
  },
);

export default enhance(Preview);
