import React from 'react';
// import PropTypes from 'prop-types';
import { compose } from 'ramda';
import { lifecycle } from 'recompose';
// import styled from 'styled-components';
import { connect } from 'react-redux';
import { Button } from '@blueprintjs/core';
import { bindActionCreators } from 'redux';
import { reduxForm } from 'redux-form';
import { Container, Title, Spacer } from '../widgets';
import { Header, HeaderLeft, HeaderRight } from '../Header';
import { getPathByName } from '../../routes';

const validate = () => {
  return {};
};

const Add = () => {
  return (
    <Container>
      <Header>
        <HeaderLeft>
          <div className="pt-icon-standard pt-icon-calendar" />
          <Spacer />
          <Title>New Event</Title>
        </HeaderLeft>
        <HeaderRight>
          <Button form="addEvent" type="submit" className="pt-intent-success pt-large">
            {' '}
            Create{' '}
          </Button>
          <Spacer />
          <Button type="submit" className="pt-intent-warning pt-large">
            Cancel
          </Button>
        </HeaderRight>
      </Header>
    </Container>
  );
};

Add.propTypes = {};

const mapStateToProps = () => ({});

const actions = {};
const mapDispatchToProps = dispatch => bindActionCreators(actions, dispatch);
const componentLifecycle = {
  componentWillMount() {
    const { history } = this.props;
    const { location: { state } } = history;
    if (!state) return history.replace(getPathByName('agenda'));
  },
};

export default compose(
  lifecycle(componentLifecycle),
  reduxForm({
    form: 'addEvent',
    validate,
  }),
  connect(mapStateToProps, mapDispatchToProps),
)(Add);
