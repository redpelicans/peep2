import React from 'react';
import PropTypes from 'prop-types';
import { Button } from '@blueprintjs/core';
import { compose, withHandlers } from 'recompose';
import { withRouter } from 'react-router';

export const LinkButton = ({ icon, className, handleClick, text }) => (
  <Button icon={icon} onClick={handleClick} className={className} text={text} />
);

LinkButton.propTypes = {
  icon: PropTypes.string,
  className: PropTypes.string,
  handleClick: PropTypes.func,
  text: PropTypes.string,
};

const enhance = compose(
  withRouter,
  withHandlers({
    handleClick: ({ to, history }) => () => history.push(to),
  }),
);

export default enhance(LinkButton);
