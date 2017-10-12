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
  Spacer,
} from '../widgets';
import Avatar from '../Avatar';
import { getPathByName } from '../../routes';

export const Title = styled.div`
  overflow: hidden;
  text-overflow: ellipsis;
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
        {showActions && (
          <Actions>
            <LinkButton
              to={getPathByName('editCompany', _id)}
              className="pt-small pt-button"
              iconName="pt-icon-edit"
            />
            <Spacer size="5" />
            <Button
              className="pt-small pt-button"
              iconName="pt-icon-trash"
              onClick={() => showDialog()}
            />
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
  handleMouseEnter: PropTypes.func,
  handleMouseLeave: PropTypes.func,
  showActions: PropTypes.bool,
  company: PropTypes.object.isRequired,
  filterCompanyList: PropTypes.func.isRequired,
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
