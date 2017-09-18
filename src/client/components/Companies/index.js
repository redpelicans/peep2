import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import styled from 'styled-components';
import { bindActionCreators } from 'redux';
import { isEmpty } from 'ramda';
import { getVisibleCompanies } from '../../selectors/companies';
import { List } from './List';
import AddButton from './AddButton';
import { Header, HeaderLeft, HeaderRight } from '../Header';
import { Search, SortMenu, TitleIcon, Title } from '../widgets';
import { togglePreferredFilter, togglePreferred, filterCompanyList, sortCompanyList } from '../../actions/companies';

const Container = styled.div`
  display:flex;
  flex-direction:column;
  position:relative;
  min-width:300px;
  padding: 20px;
  margin:25px;
  margin-right:100px;
  background-color: #394b59;
  border-radius: 2px;
`;

export const EmptySearch = styled.span`
  display:flex;
  flex-direction:column;
  justify-content: space-around;
  align-items: center;
  position:relative;
  margin:auto;
  min-width:100%;
  height:70px;
`;

class Companies extends Component {
  onFilterChange = (e) => {
    const { filterCompanyList } = this.props; // eslint-disable-line no-shadow
    filterCompanyList(e.target.value);
  }

  render() {
    const { companies, filter, sort, sortCompanyList, filterCompanyList } = this.props; // eslint-disable-line no-shadow

    return (
      <Container>
        <Header>
          <HeaderLeft>
            <TitleIcon name="pt-icon-standard pt-icon-home" />
            <Title title="Companies" />
          </HeaderLeft>
          <HeaderRight>
            <Search filter={filter} onChange={this.onFilterChange} resetValue={() => filterCompanyList('')} />
            <SortMenu onClick={sortCompanyList} sort={sort} />
          </HeaderRight>
        </Header>
        {isEmpty(companies) &&
        <EmptySearch>
          <span className="pt-icon-large pt-icon-geosearch" />
          No result...
        </EmptySearch>}
        <List companies={companies} filterCompanyList={filterCompanyList} togglePreferred={togglePreferred} />
        <AddButton to="/companies/add" />
      </Container>
    );
  }
}


Companies.propTypes = {
};

Companies.propTypes = {
  companies: PropTypes.array.isRequired,
  filter: PropTypes.string,
  filterCompanyList: PropTypes.func.isRequired,
  sortCompanyList: PropTypes.func.isRequired,
  sort: PropTypes.object,
};

const mapStateToProps = state => ({
  companies: getVisibleCompanies(state),
  filter: state.companies.filter,
  sort: state.companies.sort,
});

const actions = { filterCompanyList, sortCompanyList, togglePreferred, togglePreferredFilter };
const mapDispatchToProps = dispatch => bindActionCreators(actions, dispatch);

export default connect(mapStateToProps, mapDispatchToProps)(Companies);
