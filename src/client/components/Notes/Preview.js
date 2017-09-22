import React from 'react';
import PropTypes from 'prop-types';
import styled from 'styled-components';
import { withStateHandlers } from 'recompose';
import Footer from './Footer';
import { MarkdownConvertor } from '../widgets/Markdown';
import { LinkButton, PreviewContainer, Actions } from '../widgets';

const StyledLinkButton = styled(LinkButton)`margin-left: 10px;`;

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

export const CardContent = ({ note, person, entity }) => (
  <div>
    <MarkdownConvertor>{note.content}</MarkdownConvertor>
    <StyledFooterLine />
    <Footer note={note} person={person} entity={entity} />
  </div>
);

CardContent.propTypes = {
  note: PropTypes.object.isRequired,
  person: PropTypes.object,
  entity: PropTypes.object,
};

const Preview = ({ handleMouseEnter, handleMouseLeave, showActions, note, people, entity }) => (
  <PreviewContainer
    className="pt-card pt-elevation-0 pt-interactive"
    onMouseOver={handleMouseEnter}
    onMouseEnter={handleMouseEnter}
    onMouseLeave={handleMouseLeave}
  >
    {showActions && (
      <Actions>
        <StyledLinkButton to={`/note/edit/${note._id}`} className="pt-small pt-button" iconName="pt-icon-edit" />
        <Icons className="pt-icon-standard pt-icon-trash" />
      </Actions>
    )}
    <CardContent note={note} person={people[note.authorId]} entity={entity} />
  </PreviewContainer>
);

Preview.propTypes = {
  note: PropTypes.object,
  people: PropTypes.object,
  entity: PropTypes.object,
  showActions: PropTypes.bool.isRequired,
  handleMouseEnter: PropTypes.func.isRequired,
  handleMouseLeave: PropTypes.func.isRequired,
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
