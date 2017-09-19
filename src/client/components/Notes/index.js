import React from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import styled from 'styled-components';
import { filterNotesList } from '../../actions/notes';
import { Header, HeaderLeft, HeaderRight } from '../Header';
import { Title, Search, TitleIcon } from '../widgets';
import Note from './Note';
import { getVisibleNotes } from '../../selectors/notes';

export const StyledNotesWrapper = styled.div`
  margin: 1.5em 0;
  padding: 0;
  column-gap: 1.5em;
  columns: 350px;
  justify-content: center;
`;

export class Notes extends React.Component {
  onFilterChange = (e) => {
    const { filterNotesList } = this.props; // eslint-disable-line no-shadow
    filterNotesList(e.target.value);
  }

  findEntity(entityType, entityId) {
    const { companies, people } = this.props;
    const entity = entityType === 'person' ? people[entityId] : companies[entityId];
    return entity ? entity : {}; // eslint-disable-line no-unneeded-ternary
  }

  render() {
    const { notes, people, companies, filter = '' } = this.props;
    if (!notes || !people || !companies) return null;
    return (
      <div>
        <Header>
          <HeaderLeft>
            <TitleIcon name="pushpin-o" />
            <Title title="Notes" />
          </HeaderLeft>
          <HeaderRight>
            <Search filter={filter} onChange={this.onFilterChange} />
          </HeaderRight>
        </Header>
        <StyledNotesWrapper >
          {
            notes.map(note =>
              <Note key={note._id} note={note} people={people} entity={this.findEntity(note.entityType, note.entityId)} />)
          }
        </StyledNotesWrapper>
      </div>
    );
  }
}

Notes.propTypes = {
  notes: PropTypes.array.isRequired,
  filter: PropTypes.string,
  companies: PropTypes.object.isRequired,
  people: PropTypes.object.isRequired,
  filterNotesList: PropTypes.func.isRequired,
};

const mapStateToProps = state => ({
  notes: getVisibleNotes(state),
  people: state.people.data,
  companies: state.companies.data,
  filter: state.notes.filter,
});

const actions = { filterNotesList };

const mapDispatchToProps = dispatch => bindActionCreators(actions, dispatch);

export default connect(mapStateToProps, mapDispatchToProps)(Notes);
