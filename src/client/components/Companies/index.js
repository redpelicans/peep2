import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import { Link } from 'react-router-dom';
import { getVisibleCompanies } from '../../selectors/companies';
import { List } from './List';
import { Header, HeaderLeft, HeaderRight } from '../Header';
import { Container, Search, SortMenu, Title, Spacer, TitleButton } from '../widgets';
import { togglePreferredFilter, togglePreferred, filterCompanyList, sortCompanyList } from '../../actions/companies';

class Companies extends Component {
  onFilterChange = e => {
    const { filterCompanyList } = this.props; // eslint-disable-line no-shadow
    filterCompanyList(e.target.value);
  };

  render() {
    const { companies, filter, sort, sortCompanyList, filterCompanyList } = this.props; // eslint-disable-line no-shadow

    return (
      <Container>
        <Header>
          <HeaderLeft>
            <div className="pt-icon-standard pt-icon-home" />
            <Spacer />
            <Title title="Companies" />
          </HeaderLeft>
          <HeaderRight>
            <Search filter={filter} onChange={this.onFilterChange} resetValue={() => filterCompanyList('')} />
            <SortMenu onClick={sortCompanyList} sort={sort} />
            <Link to="/companies/add">
              <TitleButton iconName="plus" />
            </Link>
          </HeaderRight>
        </Header>
        <List companies={companies} filterCompanyList={filterCompanyList} togglePreferred={togglePreferred} />
      </Container>
    );
  }
}

Companies.propTypes = {};

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
