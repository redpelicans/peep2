import React from 'react';
import PropTypes from 'prop-types';
import styled from 'styled-components';
import { withStateHandlers } from 'recompose';
import { format } from 'date-fns';
import { Button } from '@blueprintjs/core';
import {
  PreviewContainer,
  Actions,
  ModalConfirmation,
  NameLink,
} from '../widgets';
import Avatar from '../Avatar';
import { getPathByName } from '../../routes';
import { getWorker } from '../../selectors/addenda';

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

const TitleRow = styled.div`
  overflow: hidden;
  text-overflow: ellipsis;
  display: flex;
  align-items: center;
`;

const StyledInfos = styled.div`
  overflow: hidden;
  text-overflow: ellipsis;
  display: flex;
  margin-left: 15px;
  flex-direction: column;
  overflow: hidden;
`;

const StyledDuration = styled.span`
  font-style: italic;
  font-size: 0.8em;
`;

export const CardContent = ({ people, workerId, startDate, endDate }) => {
  const { _id, name, avatar } = getWorker(workerId, people);
  return (
    <PreviewContainer>
      <TitleRow>
        <Avatar
          name={name}
          color={avatar.color}
          size="MEDIUM"
          to={getPathByName('person', _id)}
        />
        <StyledInfos>
          <NameLink to={getPathByName('person', _id)}>{name}</NameLink>
          <StyledDuration>
            {format(startDate, 'MMM Do YYYY')}
            {endDate && ` to ${format(endDate, 'MMM Do YYYY')}`}
          </StyledDuration>
        </StyledInfos>
      </TitleRow>
    </PreviewContainer>
  );
};

CardContent.propTypes = {
  people: PropTypes.object.isRequired,
  workerId: PropTypes.string.isRequired,
  startDate: PropTypes.object.isRequired,
  endDate: PropTypes.object,
};

export const Preview = ({
  handleMouseEnter,
  handleMouseLeave,
  showActions,
  addendum,
  people,
  showDialog,
  hideDialog,
  isDeleteDialogOpen,
  deleteAddendum,
  setEditForm,
  showModal,
}) => {
  return (
    <PreviewContainer
      className="pt-card pt-elevation-0 pt-interactive"
      onMouseOver={handleMouseEnter}
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
      showActions={showActions}
    >
      <ModalConfirmation
        isOpen={isDeleteDialogOpen}
        title="Would you like to delete this addendum?"
        reject={() => hideDialog()}
        accept={() => {
          deleteAddendum(addendum._id);
          hideDialog();
        }}
      />
      {showActions && (
        <Actions>
          <StyledButton
            className="pt-small pt-button pt-intent-danger"
            iconName="pt-icon-trash"
            onClick={() => showDialog()}
          />
          <StyledButton
            className="pt-small pt-button pt-intent-warning"
            iconName="pt-icon-edit"
            onClick={() => {
              setEditForm(addendum);
              showModal();
            }}
          />
        </Actions>
      )}
      <CardContent people={people} {...addendum} />
    </PreviewContainer>
  );
};

Preview.propTypes = {
  showActions: PropTypes.bool.isRequired,
  handleMouseEnter: PropTypes.func.isRequired,
  handleMouseLeave: PropTypes.func.isRequired,
  addendum: PropTypes.object.isRequired,
  people: PropTypes.object.isRequired,
  showDialog: PropTypes.func.isRequired,
  hideDialog: PropTypes.func.isRequired,
  isDeleteDialogOpen: PropTypes.bool.isRequired,
  deleteAddendum: PropTypes.func.isRequired,
  setEditForm: PropTypes.func,
  showModal: PropTypes.func,
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
