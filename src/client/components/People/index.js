import React from "react";
import PropTypes from "prop-types";
import { connect } from "react-redux";
import { bindActionCreators } from "redux";
import { compose, withHandlers } from "recompose";
import { getVisiblePeople, getFilter } from "../../selectors/people";
import { getCompanies } from "../../selectors/companies";
import { List } from "./List";
import AddButton from "./AddButton";
import { Header, HeaderLeft, HeaderRight } from "../Header";
import { Container, Search, SortMenu, TitleIcon, Title } from "../widgets";
import { onTagClick, deletePeople } from "../../actions/people";

const People = ({
  people,
  companies,
  onTagClick,
  onFilterChange,
  filter = "",
  deletePeople
}) => (
  <Container>
    <Header>
      <HeaderLeft>
        <TitleIcon name="pt-icon-standard pt-icon-home" />
        <Title title="People" />
      </HeaderLeft>
      <HeaderRight>
        <Search
          filter={filter}
          onChange={onFilterChange}
          resetValue={() => onTagClick("")}
        />
        <AddButton to="/people/add" />
      </HeaderRight>
    </Header>
    <List
      people={people}
      companies={companies}
      onTagClick={onTagClick}
      deletePeople={deletePeople}
    />
  </Container>
);

People.propTypes = {
  people: PropTypes.array.isRequired,
  companies: PropTypes.object.isRequired,
  onTagClick: PropTypes.func.isRequired,
  filter: PropTypes.string,
  deletePeople: PropTypes.func.isRequired
};

const mapStateToProps = state => ({
  people: getVisiblePeople(state),
  companies: getCompanies(state),
  filter: getFilter(state)
});

const actions = { onTagClick, deletePeople };
const mapDispatchToProps = dispatch => bindActionCreators(actions, dispatch);

const enhance = compose(
  connect(mapStateToProps, mapDispatchToProps),
  withHandlers({
    onFilterChange: ({ onTagClick }) => event => onTagClick(event.target.value)
  })
);

export default enhance(People);
