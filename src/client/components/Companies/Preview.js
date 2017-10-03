import React from 'react';
import PropTypes from 'prop-types';
import { isEmpty, map } from 'ramda';
import { withStateHandlers } from 'recompose';
import styled from 'styled-components';
import { Colors } from '@blueprintjs/core';
import {
  LinkButton,
  PreviewContainer,
  Tag,
  Tags,
  NameLink,
  Actions,
} from '../widgets';
import Avatar from '../Avatar';
import { getPathByName } from '../../routes';

const StyledLinkButton = styled(LinkButton)`margin-left: 10px;`;

export const Title = styled.p`
  text-transform: capitalize;
  font-size: 1em;
  white-space: nowrap;
  text-overflow: ellipsis;
  margin: 0;
  margin-left: 15px;
  color: ${Colors.LIGHT_GRAY5};
  font-weight: bold;
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
}) => {
  const handleClick = tag => filterCompanyList(`#${tag}`);
  return (
    <PreviewContainer
      className="pt-card pt-elevation-0 pt-interactive"
      onMouseOver={handleMouseEnter}
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
    >
      <TitleRow>
        {avatar && <Avatar
          name={name}
          color={avatar ? avatar.color : ''}
          size="MEDIUM"
          to={getPathByName('company', _id)}
        />}
        <Title>
          <NameLink to={getPathByName('company', _id)}>{name}</NameLink>
        </Title>
        {showActions && (
          <Actions>
            <StyledLinkButton
              to={getPathByName('editCompany', _id)}
              className="pt-small pt-button"
              iconName="pt-icon-edit"
            />
            <Icons className="pt-icon-standard pt-icon-trash" />
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
};

const enhance = withStateHandlers(
  {
    showActions: false,
  },
  {
    handleMouseLeave: () => () => ({ showActions: false }),
    handleMouseEnter: () => () => ({ showActions: true }),
  },
);

export default enhance(Preview);
