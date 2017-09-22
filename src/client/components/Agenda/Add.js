import React from 'react';
import PropTypes from 'prop-types';
import { compose, map } from 'ramda';
import { withHandlers, lifecycle } from 'recompose';
import styled from 'styled-components';
import { connect } from 'react-redux';
import { Button } from '@blueprintjs/core';
import { bindActionCreators } from 'redux';
import { Formik } from 'formik';
import { Container, Title, Spacer } from '../widgets';
import fields from '../../forms/events';
import { SchemaField, InputTextField } from '../../fields';
import { Header, HeaderLeft, HeaderRight } from '../Header';
import { getPathByName } from '../../routes';

const Form = styled.form`
  margin-top: 25px;
  width: 100%;
  display: grid;
  grid-template-rows: auto;
  grid-gap: 20px;
  grid-template-areas: 'startDate' 'endDate' 'unit' 'value' 'type' 'worker' 'status' 'description';
  @media (min-width: 900px) {
    grid-template-columns: repeat(6, minmax(100px, 1fr));
    grid-template-areas: 'startDate startDate endDate endDate unit value' 'type type worker worker worker status'
      'description description description description description description';
  }
`;

const FormField = styled(SchemaField)`grid-area: ${({ field }) => field.name};`;

const Add = ({ history, cancel, addEvent }) => {
  const { location: { state } } = history;
  const initialValues = {
    startDate: state.from,
    endDate: state.to,
    worker: state.workerId,
    status: 'COUOCU',
    unit: 'Day',
  };
  return (
    <Formik
      initialValues={initialValues}
      onSubmit={addEvent}
      render={({ values, errors, touched, handleSubmit, handleReset, setFieldValue, setFieldTouched, isSubmitting, dirty }) => {
        console.log(dirty);
        return (
          <Container>
            <Header>
              <HeaderLeft>
                <div className="pt-icon-standard pt-icon-calendar" />
                <Spacer />
                <Title>New Event</Title>
              </HeaderLeft>
              <HeaderRight>
                <Button form="addEvent" type="submit" disabled={isSubmitting} className="pt-intent-success pt-large">
                  Create
                </Button>
                <Spacer />
                <Button className="pt-intent-warning pt-large">Cancel</Button>
                <Spacer />
                <Button className="pt-intent-danger pt-large" onClick={handleReset} disabled={!dirty || isSubmitting}>
                  Reset
                </Button>
              </HeaderRight>
            </Header>
            <Form id="addEvent" onSubmit={handleSubmit}>
              {map(
                field => <FormField key={field.name} field={field} setFieldTouched={setFieldTouched} onChange={setFieldValue} values={values} />,
                fields,
              )}
            </Form>
          </Container>
        );
      }}
    />
  );
};

Add.propTypes = {
  cancel: PropTypes.func.isRequired,
  addEvent: PropTypes.func.isRequired,
  history: PropTypes.object.isRequired,
};

const mapStateToProps = state => ({});

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
  withHandlers({
    cancel: ({ history }) => () => history.goBack(),
    addEvent: () => values => console.log(values),
  }),
  connect(mapStateToProps, mapDispatchToProps),
)(Add);
