import React from 'react';
import PropTypes from 'prop-types';
import { Icon } from '@blueprintjs/core';
import styled from 'styled-components';
import { format } from 'date-fns';
import { NameLink } from '../widgets';
import Avatar from '../Avatar';
import { getPathByName } from '../../routes';

export const StyledFooter = styled.div`
  display: grid;
  grid-gap: 10px;
  align-items: center;
  grid-template-columns: repeat(5, [col] 1fr);
  justify-content: center;
`;

const StyledMain = styled.div`
  align-items: center;
  grid-column: col 2 / span 3;
  display: flex;
  flex-direction: column;
`;

const StyledName = styled.div`
  font-size: 1rem;
  font-weight: bold;
  text-overflow: ellipsis;
  overflow: hidden;
  max-width: 190px;
`;

const entityIcon = {
  person: 'user',
  mission: 'shopping-cart',
  company: 'home',
};

const StyledCreatedAt = styled.span`
  font-style: italic;
  font-size: 0.8em;
`;

const StyledEntity = styled.div`
  padding-right: 2px;
  display: flex;
  justify-content: center;
  grid-column: col 1;
`;

const StyledAuthor = styled.div`
  display: flex;
  justify-content: center;
  grid-column: col 5;
`;

const Footer = ({ note, person, entity }) => {
  if (!note) return null;
  return (
    <StyledFooter>
      <StyledEntity>
        {entity &&
          entity.avatar && (
            <Avatar
              name={entity.name}
              size="MEDIUM"
              to={getPathByName(entity.typeName, entity._id)}
              {...entity.avatar}
            />
          )}
      </StyledEntity>
      <StyledMain>
        <StyledName>
          <Icon
            icon={entityIcon[note.entityType]}
            style={{ marginRight: '4px' }}
          />
          {entity && entity.typeName ? (
            <NameLink to={getPathByName(entity.typeName, entity._id)}>
              {entity.name}
            </NameLink>
          ) : (
            entity.name
          )}
        </StyledName>
        {note.createdAt && (
          <StyledCreatedAt>
            {format(note.createdAt, 'dddd, MMMM Do YYYY')}
          </StyledCreatedAt>
        )}
      </StyledMain>
      <StyledAuthor>
        {person &&
          person.avatar && (
            <Avatar
              name={person.name}
              size="SMALL"
              to={getPathByName('person', person._id)}
              {...person.avatar}
            />
          )}
      </StyledAuthor>
    </StyledFooter>
  );
};

Footer.propTypes = {
  note: PropTypes.object.isRequired,
  entity: PropTypes.object.isRequired,
  person: PropTypes.object,
};

export default Footer;
