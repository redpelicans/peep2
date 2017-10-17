import React from 'react';
import PropTypes from 'prop-types';
import { withStateHandlers } from 'recompose';
import styled from 'styled-components';
import { Colors, Button } from '@blueprintjs/core';
import { map } from 'ramda';
import {
  LinkButton,
  PreviewContainer,
  NameLink,
  Actions,
  ModalConfirmation,
} from '../widgets';
import Avatar from '../Avatar';
import { getPathByName } from '../../routes';

const StyledLinkButton = styled(LinkButton)`
  margin-left: 5px;
  margin-right: 5px;
  margin-top: 5px;
`;

const StyledButton = styled(Button)`
  margin-right: 5px;
  margin-top: 5px;
`;

export const Title = styled.p`
  overflow: hidden;
  text-transform: capitalize;
  font-size: 1em;
  margin: 0;
  margin-left: 15px;
  color: ${Colors.LIGHT_GRAY5};
`;

const TitleRow = styled.div`
  display: flex;
  align-items: center;
`;

export const Icons = styled.div`
  margin-left: 5px;
  margin-right: 5px;
  color: rgb(68, 86, 99);
`;

export const Preview = ({
  handleMouseEnter,
  handleMouseLeave,
  showActions,
  client,
  people,
  mission: { _id, name },
  deleteMission,
  isDeleteDialogOpen,
  showDialog,
  hideDialog,
}) => {
  return (
    <PreviewContainer
      className="pt-card pt-elevation-0 pt-interactive"
      onMouseOver={handleMouseEnter}
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
    >
      {showActions && (
        <Actions>
          <StyledLinkButton
            to={getPathByName('editMission', _id)}
            className="pt-small pt-button pt-intent-warning"
            iconName="pt-icon-edit"
          />
          <StyledButton
            className="pt-small pt-button pt-intent-danger"
            iconName="pt-icon-trash"
            onClick={() => showDialog()}
          />
        </Actions>
      )}
      <ModalConfirmation
        isOpen={isDeleteDialogOpen}
        title="Would you like to delete this mission?"
        reject={() => hideDialog()}
        accept={() => deleteMission(_id)}
      />
      <TitleRow>
        {client &&
          client.avatar && (
            <Avatar
              name={client.name}
              color={client.avatar ? client.avatar.color : ''}
              size="MEDIUM"
              to={getPathByName('company', client._id)}
            />
          )}
        <Title>
          <NameLink to={getPathByName('company', _id)}>{name}</NameLink>
        </Title>
      </TitleRow>
    </PreviewContainer>
  );
};

Preview.propTypes = {
  handleMouseEnter: PropTypes.func,
  handleMouseLeave: PropTypes.func,
  showActions: PropTypes.bool,
  mission: PropTypes.object.isRequired,
  deleteMission: PropTypes.func.isRequired,
  showDialog: PropTypes.func.isRequired,
  hideDialog: PropTypes.func.isRequired,
  isDeleteDialogOpen: PropTypes.bool.isRequired,
  client: PropTypes.object,
  people: PropTypes.object,
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
