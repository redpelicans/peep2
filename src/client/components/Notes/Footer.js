import React from 'react';
import PropTypes from 'prop-types';
import { Icon } from '@blueprintjs/core';
import styled from 'styled-components';
import { NameLink } from '../widgets';
import Avatar from '../Avatar';
import { getPathByName } from '../../routes';

const StyledFooter = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
`;

const StyledMain = styled.div`
  display: flex;
  flex-direction: column;
`;

const StyledName = styled.div`
  font-size: 1rem;
  font-weight: bold;
  white-space: nowrap;
  text-overflow: ellipsis;
  overflow: hidden;
  max-width: 200px;
`;

const entityIcon = {
  person: 'user',
  mission: 'shopping-cart',
  company: 'home',
};

const Footer = ({ note, person, entity }) => {
  if (!person || !entity || !note) return null;
  return (
    <StyledFooter>
      {entity.avatar && <Avatar name={entity.name} to={getPathByName(entity.typeName, entity._id)} {...entity.avatar} />}
      <StyledMain>
        <StyledName>
          <Icon iconName={entityIcon[note.entityType]} style={{ marginRight: '4px' }} />
          {entity.typeName ? <NameLink to={getPathByName(entity.typeName, entity._id)}>{entity.name}</NameLink> : entity.name}
        </StyledName>
        <span>{note.createdAt}</span>
      </StyledMain>
      {person.avatar && (
        <Avatar
          name={person.name}
          {...person.avatar}
          to={getPathByName('person', person._id)}
          style={{
            minWidth: '30px',
            width: '30px',
            height: '30px',
            fontSize: '.8rem',
          }}
        />
      )}
    </StyledFooter>
  );
};

Footer.propTypes = {
  note: PropTypes.object.isRequired,
  entity: PropTypes.object.isRequired,
  person: PropTypes.object,
};

export default Footer;
