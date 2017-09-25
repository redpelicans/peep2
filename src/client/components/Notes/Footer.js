import React from 'react';
import PropTypes from 'prop-types';
import { Icon } from '@blueprintjs/core';
import styled from 'styled-components';
import Avatar from '../Avatar';

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
      {entity.avatar && (
        <Avatar name={entity.name} {...entity.avatar} showTooltip />
      )}
      <StyledMain>
        <StyledName>
          <Icon
            iconName={entityIcon[note.entityType]}
            style={{ marginRight: '4px' }}
          />
          {entity.name}
        </StyledName>
        <span>{note.createdAt}</span>
      </StyledMain>
      {person.avatar && (
        <Avatar
          name={person.name}
          {...person.avatar}
          style={{
            minWidth: '30px',
            width: '30px',
            height: '30px',
            fontSize: '.8rem',
          }}
          showTooltip
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
