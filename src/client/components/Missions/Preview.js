import React from 'react';
import PropTypes from 'prop-types';
import { withStateHandlers } from 'recompose';
import styled from 'styled-components';
import { Button } from '@blueprintjs/core';
import { map, isEmpty } from 'ramda';
import {
  LinkButton,
  PreviewContainer,
  NameLink,
  CompanyLink,
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

export const MissionTitle = styled.p`
  overflow: hidden;
  text-overflow: ellipsis;
  text-transform: capitalize;
  margin: 0;
`;

const ClientTitle = styled.p`
  overflow: hidden;
  text-overflow: ellipsis;
`;

const TitleRow = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  width: 100%;
`;

export const Icons = styled.div`
  margin-left: 5px;
  margin-right: 5px;
  color: rgb(68, 86, 99);
`;

const PreviewLeft = styled.span`width: 20%;`;

const PreviewCenter = styled.span`
  width: 50%;
  flex-direction: column;
  text-align: center;
  margin: 0 10px;
`;

const PreviewRight = styled.span`
  width: 30%;
  overflow: hidden;
`;

const StyledManager = styled.div`text-align: right;`;

export const Preview = ({
  handleMouseEnter,
  handleMouseLeave,
  showActions,
  client,
  manager,
  workers,
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
          <StyledButton
            className="pt-small pt-button pt-intent-danger"
            iconName="pt-icon-trash"
            onClick={() => showDialog()}
          />
          <StyledLinkButton
            to={getPathByName('editMission', _id)}
            className="pt-small pt-button pt-intent-warning"
            iconName="pt-icon-edit"
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
        <PreviewLeft>
          {client &&
            client.avatar && (
              <Avatar
                name={client.name}
                color={client.avatar.color}
                size="MEDIUM"
                to={getPathByName('company', client._id)}
              />
            )}
          {manager &&
            manager.avatar && (
              <StyledManager>
                <Avatar
                  name={manager.name}
                  color={manager.avatar.color}
                  size="SMALL"
                  to={getPathByName('person', manager._id)}
                />
              </StyledManager>
            )}
        </PreviewLeft>
        <PreviewCenter>
          <MissionTitle>
            <NameLink to={getPathByName('mission', _id)}>{name}</NameLink>
          </MissionTitle>
          {client && (
            <ClientTitle>
              <CompanyLink to={getPathByName('company', client._id)}>
                {client.name}
              </CompanyLink>
            </ClientTitle>
          )}
        </PreviewCenter>
        <PreviewRight>
          {!isEmpty(workers) &&
            map(worker => {
              const { _id, avatar, name } = worker;
              if (avatar) {
                return (
                  <Avatar
                    key={_id}
                    name={name}
                    color={avatar.color}
                    size="SMALL"
                    to={getPathByName('person', _id)}
                  />
                );
              }
            }, workers)}
        </PreviewRight>
      </TitleRow>
    </PreviewContainer>
  );
};

Preview.propTypes = {
  handleMouseEnter: PropTypes.func,
  handleMouseLeave: PropTypes.func,
  showActions: PropTypes.bool,
  mission: PropTypes.object.isRequired,
  manager: PropTypes.object,
  deleteMission: PropTypes.func.isRequired,
  showDialog: PropTypes.func.isRequired,
  hideDialog: PropTypes.func.isRequired,
  isDeleteDialogOpen: PropTypes.bool.isRequired,
  client: PropTypes.object,
  workers: PropTypes.array,
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
