import React from 'react';
import PropTypes from 'prop-types';
import { identity, omit } from 'ramda';

export const propTransformer = (src, target, fn = identity) => Component => {
  const Transformer = props => {
    const newProps = { ...omit([src], props), [target]: fn(props[src]) };
    return <Component {...newProps} />;
  };

  Transformer.propTypes = {
    workers: PropTypes.array.isRequired,
  };

  return Transformer;
};
