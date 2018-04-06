import React from 'react';
import PropTypes from 'prop-types';
import { isEmpty, map } from 'ramda';
import { withStateHandlers } from 'recompose';
import styled from 'styled-components';
import { Button } from '@blueprintjs/core';
import {
  LinkButton,
  PreviewContainer,
  Tag,
  Tags,
  NameLink,
  CompanyLink,
  Actions,
  ModalConfirmation,
} from '../widgets';
import Avatar from '../Avatar';
import { getPathByName, getRouteAuthProps } from '../../routes';
import { Auth } from '../../lib/kontrolo';

export const TitleRow = styled.div`
  overflow: hidden;
  text-overflow: ellipsis;
  display: flex;
  align-items: center;
`;

export const StyledInfos = styled.div`
  overflow: hidden;
  text-overflow: ellipsis;
  display: flex;
  margin-left: 15px;
  flex-direction: column;
  overflow: hidden;
`;

export const Icons = styled.div`
  margin-left: 5px;
  margin-right: 5px;
  color: rgb(68, 86, 99);
`;

const StyledButton = styled(Button)`
  margin-right: 5px;
  margin-top: 5px;
`;

const StyledLinkButton = styled(LinkButton)`
  margin-left: 5px;
  margin-right: 5px;
  margin-top: 5px;
`;

export const Preview = ({
  handleMouseEnter,
  handleMouseLeave,
  showActions,
  person: { _id, name, avatar, tags = [] },
  person,
  company = {},
  onTagClick,
  deletePeople,
  isDeleteDialogOpen,
  showDialog,
  hideDialog,
}) => {
  const handleClick = tag => onTagClick(`#${tag}`);
  return (
    <PreviewContainer
      className="pt-card pt-elevation-0 pt-interactive"
      onMouseOver={handleMouseEnter}
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
    >
      <ModalConfirmation
        isOpen={isDeleteDialogOpen}
        title="Would you like to delete this people?"
        reject={() => hideDialog()}
        accept={() => deletePeople(_id)}
      />
      <TitleRow>
        {avatar && (
          <Avatar
            name={name}
            color={avatar.color}
            size="MEDIUM"
            to={getPathByName('person', _id)}
          />
        )}
        <StyledInfos>
          <NameLink to={getPathByName('person', _id)}>{name}</NameLink>
          {company && (
            <CompanyLink to={getPathByName('company', company._id)}>
              {company.name}
            </CompanyLink>
          )}
        </StyledInfos>
        {showActions && (
          <Actions>
            <Auth {...getRouteAuthProps('deletePerson')} context={{ person }}>
              <StyledButton
                className="pt-small pt-button pt-intent-danger"
                icon="trash"
                onClick={() => showDialog()}
              />
            </Auth>
            <Auth {...getRouteAuthProps('editPerson')} context={{ person }}>
              <StyledLinkButton
                to={getPathByName('editPerson', _id)}
                className="pt-small pt-button pt-intent-warning"
                icon="edit"
              />
            </Auth>
          </Actions>
        )}
      </TitleRow>
      {!isEmpty(tags) && (
        <Tags>
          {map(tag => (
            <Tag key={tag} onClick={() => handleClick(tag)}>
              {tag}
            </Tag>
          ))(tags)}
        </Tags>
      )}
    </PreviewContainer>
  );
};

Preview.propTypes = {
  handleMouseEnter: PropTypes.func.isRequired,
  handleMouseLeave: PropTypes.func.isRequired,
  showActions: PropTypes.bool.isRequired,
  person: PropTypes.object.isRequired,
  company: PropTypes.object,
  onTagClick: PropTypes.func,
  deletePeople: PropTypes.func.isRequired,
  showDialog: PropTypes.func.isRequired,
  hideDialog: PropTypes.func.isRequired,
  isDeleteDialogOpen: PropTypes.bool.isRequired,
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
