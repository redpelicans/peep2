import React from 'react';
import { IntlProvider } from 'react-intl';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';
import { Spinner } from '@blueprintjs/core';

const ConnectedIntlProvider = ({ children, locale, messages = {} }) => {
  if (!locale) return <Spinner />;
  return (
    <IntlProvider locale={locale} messages={messages}>
      {children}
    </IntlProvider>
  );
};

const mapStateToProps = state => ({
  locale: state.intl.locale,
  messages: state.intl.messages[state.intl.locale] || {},
});

ConnectedIntlProvider.propTypes = {
  children: PropTypes.node,
  locale: PropTypes.string,
  messages: PropTypes.object,
};

export default connect(mapStateToProps)(ConnectedIntlProvider);
