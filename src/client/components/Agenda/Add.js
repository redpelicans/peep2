import React from 'react';
import PropTypes from 'prop-types';
import { compose } from 'ramda';
import { differenceInDays } from 'date-fns';
import { withHandlers, lifecycle } from 'recompose';
import styled from 'styled-components';
import { connect } from 'react-redux';
import { Button } from '@blueprintjs/core';
import { bindActionCreators } from 'redux';
import { Formik } from 'formik';
import { Container, Title, Spacer } from '../widgets';
import {
  defaultValues,
  getField,
  getValidationSchema,
} from '../../forms/events';
import { Header, HeaderLeft, HeaderRight } from '../Header';
import { getPathByName } from '../../routes';
import { FormField } from '../../fields';

const Form = styled.form`
  margin-top: 25px;
  width: 100%;
  display: grid;
  grid-template-rows: auto;
  grid-gap: 20px;
  grid-template-areas: 'startDate' 'endDate' 'unit' 'value' 'type' 'worker'
    'status' 'description';
  @media (min-width: 900px) {
    grid-template-columns: repeat(6, minmax(100px, 1fr));
    grid-template-areas: 'startDate startDate endDate endDate value unit'
      'type type worker worker worker status'
      'description description description description description description';
  }
`;

const StyledFormField = styled(FormField)`
  grid-area: ${({ field }) => field.name};
`;

const Add = ({ history, cancel, addEvent }) => {
  const { location: { state } } = history;
  const initialValues = {
    ...defaultValues,
    startDate: state.from,
    endDate: state.to,
    worker: state.workerId,
    value: differenceInDays(state.to, state.from) + 1,
  };
  return (
    <Formik
      initialValues={initialValues}
      validationSchema={getValidationSchema()}
      isInitialValid={({ validationSchema, initialValues }) =>
        validationSchema.isValid(initialValues)}
      onSubmit={addEvent}
      render={({
        values,
        isValid,
        errors,
        touched,
        handleSubmit,
        handleReset,
        setFieldValue,
        setFieldTouched,
        isSubmitting,
        dirty,
      }) => {
        const [startDate, endDate] = [values['startDate'], values['endDate']];
        console.log(isValid);
        console.log(errors);
        return (
          <Container>
            <Header>
              <HeaderLeft>
                <div className="pt-icon-standard pt-icon-calendar" />
                <Spacer />
                <Title>New Event</Title>
              </HeaderLeft>
              <HeaderRight>
                <Button
                  form="addEvent"
                  type="submit"
                  disabled={isSubmitting || !isValid}
                  className="pt-intent-success pt-large"
                >
                  Create
                </Button>
                <Spacer />
                <Button className="pt-intent-warning pt-large">Cancel</Button>
                <Spacer />
                <Button
                  className="pt-intent-danger pt-large"
                  onClick={handleReset}
                  disabled={!dirty || isSubmitting}
                >
                  Reset
                </Button>
              </HeaderRight>
            </Header>
            <Form id="addEvent" onSubmit={handleSubmit}>
              <StyledFormField
                field={getField('startDate')}
                values={values}
                errors={errors}
                setFieldTouched={setFieldTouched}
                setFieldValue={setFieldValue}
              />
              <StyledFormField
                field={getField('endDate')}
                values={values}
                errors={errors}
                setFieldTouched={setFieldTouched}
                setFieldValue={setFieldValue}
              />
              <StyledFormField
                field={getField('worker')}
                values={values}
                setFieldValue={setFieldValue}
                setFieldTouched={setFieldTouched}
              />

              <StyledFormField
                field={getField('value')}
                value={differenceInDays(endDate, startDate) + 1}
                errors={errors}
                disabled={true}
                type="number"
              />

              <StyledFormField
                field={getField('unit')}
                values={values}
                errors={errors}
                disabled={true}
                type="text"
              />

              <StyledFormField
                field={getField('type')}
                values={values}
                errors={errors}
                type="text"
                setFieldValue={setFieldValue}
                setFieldTouched={setFieldTouched}
              />

              <StyledFormField
                field={getField('status')}
                values={values}
                errors={errors}
                type="text"
                setFieldValue={setFieldValue}
                setFieldTouched={setFieldTouched}
              />

              <StyledFormField
                field={getField('description')}
                values={values}
                errors={errors}
                type="text"
                setFieldValue={setFieldValue}
                setFieldTouched={setFieldTouched}
              />
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
