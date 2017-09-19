import React from 'react';
import PropTypes from 'prop-types';
import styled from 'styled-components';
import Footer from './Footer';
import { MarkdownConvertor } from '../widgets/Markdown';

export const StyledNoteWrap = styled.div`
  margin: 0 auto;
  width: 90%;
`;

export const StyledFooterLine = styled.hr`
  margin-top: 10px;
  margin-bottom: 10px;
`;

export const StyledCard = styled.div`
  display: 'inline-block';
  margin: '8px';
  minWidth: '250px';
  width: '100%';
  padding: '12px';
  backgroundColor: '#f0f0f0';
`;

export const CardContent = ({ note, person, entity }) => (
  <div>
    <MarkdownConvertor>
      {note.content}
    </MarkdownConvertor>
    <StyledFooterLine />
    <Footer note={note} person={person} entity={entity} />
  </div>
);

CardContent.propTypes = {
  note: PropTypes.object.isRequired,
  person: PropTypes.object,
  entity: PropTypes.object.isRequired,
};

const Note = ({ note, people, entity }) => (
  <StyledNoteWrap>
    <div style={{
      display: 'inline-block',
      margin: '8px',
      minWidth: '250px',
      width: '100%',
      padding: '12px',
      backgroundColor: '#f0f0f0',
    }}
    >
      <CardContent
        note={note}
        person={people[note.authorId]}
        entity={entity}
      />
    </div>
  </StyledNoteWrap>
);

Note.propTypes = {
  note: PropTypes.object.isRequired,
  people: PropTypes.object.isRequired,
  entity: PropTypes.object.isRequired,
};

export default Note;
