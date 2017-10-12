import React from 'react';
import PropTypes from 'prop-types';
import styled from 'styled-components';
import { withStateHandlers } from 'recompose';
import Footer from './Footer';
import { MarkdownConvertor } from '../widgets/Markdown';
import { Button } from '@blueprintjs/core';
import {
  LinkButton,
  PreviewContainer,
  Actions,
  ModalConfirmation,
} from '../widgets';
import { getPathByName } from '../../routes';

const StyledLinkButton = styled(LinkButton)`margin-left: 10px;`;

const StyledButton = styled(Button)`margin-left: 10px;`;

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

export const CardContent = ({ note, person, entity }) => (
  <div>
    <MarkdownConvertor>{note.content}</MarkdownConvertor>
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
}) => (
  <PreviewContainer
    className="pt-card pt-elevation-0 pt-interactive"
    onMouseOver={handleMouseEnter}
    onMouseEnter={handleMouseEnter}
    onMouseLeave={handleMouseLeave}
  >
    <ModalConfirmation
      isOpen={isDeleteDialogOpen}
      title="Would you like to delete this note?"
      reject={() => hideDialog()}
      accept={() => deleteNote(note._id)}
    />
    {showActions && (
      <Actions>
        <StyledLinkButton
          to={getPathByName('editNote', note._id)}
          className="pt-small pt-button"
          iconName="pt-icon-edit"
        />
        <StyledButton
          className="pt-small pt-button"
          iconName="pt-icon-trash"
          onClick={() => showDialog()}
        />
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
};

const enhance = withStateHandlers(
  {
    showActions: false,
    isDeleteDialogOpen: false,
  },
  {
    handleMouseLeave: () => () => ({ showActions: false }),
    handleMouseEnter: () => () => ({ showActions: true }),
    showDialog: () => () => ({ isDeleteDialogOpen: true }),
    hideDialog: () => () => ({ isDeleteDialogOpen: false }),
  },
);

export default enhance(Preview);
