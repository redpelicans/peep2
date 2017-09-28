import React from 'react';
import PropTypes from 'prop-types';
import { compose, sum, pluck } from 'ramda';
import { startOfDay, endOfDay, addWeeks, subWeeks } from 'date-fns';
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
import { FormField } from '../../fields';
import WorkerCalendar from './Calendar/Worker';

const StyledContainer = styled(Container)`min-width: 300px;`;
const StyledForm = styled.div`
  display: flex;
  justify-content: center;
`;

const VSpacer = styled.div`
  margin-top: 15px;
  grid-area: spacer;
`;

const Form = styled.form`
  padding: 20px;
  margin-top: 50px;
  width: 90%;
  display: grid;
  grid-gap: 20px;
  justify-content: center;
  grid-template-columns: auto;
  grid-template-rows: auto;
  grid-template-areas: 'calendar' 'period' 'valueUnit' 'type' 'workerId'
    'status' 'description';
  @media (min-width: 900px) {
    grid-template-columns: repeat(3, minmax(100px, 1fr));
    grid-template-areas: 'calendar calendar calendar' 'period period period'
      'valueUnit valueUnit valueUnit' 'type workerId status'
      'description description description';
  }
`;

const StyledCalendar = styled(WorkerCalendar)`
  justify-content: center;
  grid-area: calendar;
`;

const StyledFormField = styled(FormField)`
  justify-content: center;
  grid-area: ${({ field }) => field.name};
`;

const StyledValueUnit = styled.div`
  grid-area: valueUnit;
  display: flex;
  align-items: center;
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
  const calendarPeriod = [
    startOfDay(subWeeks(state.from, 1)),
    endOfDay(addWeeks(state.to, 1)),
  ];
  const selectedPeriod = [startOfDay(state.from), endOfDay(state.to)];
  const initialValues = {
    ...defaultValues,
    period: selectedPeriod,
    workerId: state.workerId,
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
        touched,
        isValid,
        errors,
        handleSubmit,
        handleReset,
        setFieldValue,
        setFieldTouched,
        isSubmitting,
        dirty,
      }) => {
        const [from, to] = values['period'];
        const [minDate, maxDate] = calendarPeriod;
        const currentWorker = workers[state.workerId];
        const workerEvents = events[state.workerId];
        const newEvents = freeEventsFromPeriod({
          from,
          to,
          events: workerEvents,
          calendar,
        });
        const daysCount = compose(sum, pluck('value'))(newEvents);
        return (
          <StyledContainer>
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
            <StyledForm>
              <Form id="addEvent" onSubmit={handleSubmit}>
                <StyledCalendar
                  startDate={minDate}
                  endDate={maxDate}
                  from={from}
                  to={to}
                  events={workerEvents}
                  worker={currentWorker}
                  calendar={calendar}
                />
                <PeriodPicker
                  field={getField('period')}
                  from={from}
                  to={to}
                  setFieldTouched={setFieldTouched}
                  setFieldValue={setFieldValue}
                  minDate={minDate}
                  maxDate={maxDate}
                />
                <StyledFormField
                  field={getField('workerId')}
                  values={values}
                  touched={touched}
                  setFieldValue={setFieldValue}
                  setFieldTouched={setFieldTouched}
                />

                <ValueUnit
                  name="valueUnit"
                  value={daysCount}
                  unit={count => (count > 1 ? 'working days' : 'working day')}
                />

                <StyledFormField
                  field={getField('type')}
                  values={values}
                  errors={errors}
                  touched={touched}
                  type="text"
                  setFieldValue={setFieldValue}
                  setFieldTouched={setFieldTouched}
                />

                <StyledFormField
                  field={getField('status')}
                  values={values}
                  errors={errors}
                  touched={touched}
                  type="text"
                  setFieldValue={setFieldValue}
                  setFieldTouched={setFieldTouched}
                />
                <VSpacer />
                <StyledFormField
                  field={getField('description')}
                  values={values}
                  errors={errors}
                  touched={touched}
                  type="text"
                  setFieldValue={setFieldValue}
                  setFieldTouched={setFieldTouched}
                  height="10em"
                />
              </Form>
            </StyledForm>
          </StyledContainer>
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
