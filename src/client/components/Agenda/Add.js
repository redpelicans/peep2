import React from 'react';
import PropTypes from 'prop-types';
import { compose, sum, pluck } from 'ramda';
import { addWeeks, subWeeks, differenceInDays } from 'date-fns';
import { withHandlers, lifecycle } from 'recompose';
import styled from 'styled-components';
import { connect } from 'react-redux';
import { Button } from '@blueprintjs/core';
import { bindActionCreators } from 'redux';
import { Formik } from 'formik';
import { getCalendar } from '../../selectors/calendar';
import { getWorkers } from '../../selectors/people';
import { getEventsByWorkerDate } from '../../selectors/events';
import { Container, Title, Spacer } from '../widgets';
import { freeEventsFromPeriod } from '../../utils/events';
import PeriodPicker from './PeriodPicker';
import {
  defaultValues,
  getField,
  getValidationSchema,
} from '../../forms/events';
import { Header, HeaderLeft, HeaderRight } from '../Header';
import { getPathByName } from '../../routes';
import { Field, FormField } from '../../fields';
import { WorkerCalendar } from './WorkersCalendar';

const Form = styled.form`
  margin-top: 25px;
  width: 100%;
  display: grid;
  grid-template-rows: auto;
  grid-gap: 20px;
  grid-template-areas: 'period' 'valueUnit' 'type' 'workerId' 'status'
    'description';
  @media (min-width: 900px) {
    grid-template-columns: repeat(3, minmax(100px, 1fr));
    grid-template-rows: auto auto auto;
    grid-template-areas: 'period period valueUnit ' 'type workerId status'
      'description description description';
  }
  @media (min-width: 1600px) {
    grid-template-columns: repeat(6, minmax(100px, 1fr));
    grid-template-rows: auto auto;
    grid-template-areas: 'period period valueUnit type workerId status'
      'description description description description description description';
  }
`;

const StyledFormField = styled(FormField)`
  grid-area: ${({ field }) => field.name};
`;

const StyledValueUnit = styled.div`
  grid-area: valueUnit;
  display: flex;
  align-items: flex-end;
  justify-content: center;
  font-style: italic;
  font-size: 3em;
`;

const ValueUnit = ({ value, unit }) => (
  <StyledValueUnit>{`${value} ${unit(value)}`}</StyledValueUnit>
);

ValueUnit.propTypes = {
  value: PropTypes.number.isRequired,
  unit: PropTypes.func.isRequired,
};

const Add = ({ history, cancel, addEvent, workers, events, calendar }) => {
  const { location: { state } } = history;
  const initialValues = {
    ...defaultValues,
    period: [state.from, state.to],
    endDate: state.to,
    workerId: state.workerId,
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
        handleSubmit,
        handleReset,
        setFieldValue,
        setFieldTouched,
        isSubmitting,
        dirty,
      }) => {
        const [startDate, endDate] = values['period'];
        const [minDate, maxDate] = [
          subWeeks(state.from, 1),
          addWeeks(state.to, 1),
        ];
        const currentWorker = workers[state.workerId];
        const workerEvents = events[state.workerId];
        const newEvents = freeEventsFromPeriod({
          from: startDate,
          to: endDate,
          events: workerEvents,
          calendar,
        });
        const daysCount = compose(sum, pluck('value'))(newEvents);
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
            <WorkerCalendar
              startDate={minDate}
              endDate={maxDate}
              from={startDate}
              to={endDate}
              events={workerEvents}
              worker={currentWorker}
              calendar={calendar}
            />
            <Form id="addEvent" onSubmit={handleSubmit}>
              <PeriodPicker
                field={getField('period')}
                from={startDate}
                to={endDate}
                setFieldTouched={setFieldTouched}
                setFieldValue={setFieldValue}
                minDate={minDate}
                maxDate={maxDate}
              />
              <StyledFormField
                field={getField('workerId')}
                values={values}
                setFieldValue={setFieldValue}
                setFieldTouched={setFieldTouched}
              />

              <ValueUnit
                name="valueUnit"
                value={daysCount}
                unit={count => (count > 1 ? 'days' : 'day')}
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
                height="10em"
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
  workers: PropTypes.object.isRequired,
  calendar: PropTypes.object,
  events: PropTypes.object.isRequired,
};

const mapStateToProps = state => ({
  calendar: getCalendar(state),
  workers: getWorkers(state),
  events: getEventsByWorkerDate(state),
});

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
