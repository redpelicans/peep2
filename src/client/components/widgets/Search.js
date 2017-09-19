import React from 'react';
import PropTypes from 'prop-types';
import styled from 'styled-components';
import classNames from 'classnames';
import { intlShape, injectIntl } from 'react-intl';

const SearchBar = styled.div`
`;

const Search = ({ onChange, filter, resetValue, classname, intl }) => {
  const searchCls = classNames('pt-input-group', classname);
  return (
    <SearchBar className={searchCls}>
      <span className="pt-icon pt-icon-search" />
      <input
        className="pt-input"
        type="search"
        placeholder={
          intl.formatMessage({
            id: 'widget.search.placeholder',
            defaultMessage: 'Search',
          })
        }
        dir="auto"
        value={filter}
        onChange={onChange}
      />
      {filter && <span className="pt-icon pt-icon-cross" onClick={resetValue} />}
    </SearchBar>
  );
};

Search.propTypes = {
  onChange: PropTypes.func.isRequired,
  filter: PropTypes.string,
  resetValue: PropTypes.func,
  classname: PropTypes.string,
  intl: intlShape.isRequired,
};

export default injectIntl(Search);
