import React from 'react';
import PropTypes from 'prop-types';
import { isEmpty, map } from 'ramda';
import { withStateHandlers } from 'recompose';
import styled from 'styled-components';
import { Colors, Button } from '@blueprintjs/core';
import {
  LinkButton,
  PreviewContainer,
  Tag,
  Tags,
  NameLink,
  Actions,
  ModalConfirmation,
} from '../widgets';
import Avatar from '../Avatar';
import { getPathByName, getRouteAuthProps } from '../../routes';
import { Auth } from '../../lib/kontrolo';

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
  company: { _id, name, avatar, tags = [] },
  company,
  filterCompanyList,
  deleteCompany,
  isDeleteDialogOpen,
  showDialog,
  hideDialog,
}) => {
  const handleClick = tag => filterCompanyList(`#${tag}`);
  return (
    <PreviewContainer
      className="pt-card pt-elevation-0 pt-interactive"
      onMouseOver={handleMouseEnter}
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
    >
      {showActions && (
        <Actions>
          <Auth {...getRouteAuthProps('deleteCompany')} context={{ company }}>
            <StyledButton
              className="pt-small pt-button pt-intent-danger"
              iconName="pt-icon-trash"
              onClick={() => showDialog()}
            />
          </Auth>
          <Auth {...getRouteAuthProps('editCompany')} context={{ company }}>
            <StyledLinkButton
              to={getPathByName('editCompany', _id)}
              className="pt-small pt-button pt-intent-warning"
              iconName="pt-icon-edit"
            />
          </Auth>
        </Actions>
      )}
      <ModalConfirmation
        isOpen={isDeleteDialogOpen}
        title="Would you like to delete this company?"
        reject={() => hideDialog()}
        accept={() => deleteCompany(_id)}
      />
      <TitleRow>
        {avatar && (
          <Avatar
            name={name}
            color={avatar ? avatar.color : ''}
            size="MEDIUM"
            to={getPathByName('company', _id)}
          />
        )}
        <Title>
          <NameLink to={getPathByName('company', _id)}>{name}</NameLink>
        </Title>
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
  handleMouseEnter: PropTypes.func,
  handleMouseLeave: PropTypes.func,
  showActions: PropTypes.bool,
  company: PropTypes.object.isRequired,
  filterCompanyList: PropTypes.func,
  deleteCompany: PropTypes.func.isRequired,
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
