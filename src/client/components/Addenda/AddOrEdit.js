import React from 'react';
import PropTypes from 'prop-types';
import { compose, lifecycle } from 'recompose';
import styled from 'styled-components';
import { FormField } from '../../fields';
import { getField } from '../../forms/addenda';

const MissionForm = styled.form`
  display: grid;
  margin: auto;
  margin-top: 25px;
  margin-bottom: 25px;
  width: 90%;
  grid-gap: 20px;
  grid-auto-columns: minmax(70px, auto);
  grid-auto-rows: minmax(70px, auto);
  grid-template-areas: 'workerId' 'dates' 'amount' 'unit' 'currency';
  @media (min-width: 700px) {
    grid-template-areas: 'workerId workerId workerId' 'dates dates none'
      'amount unit currency';
  }
`;

const StyledFormField = styled(FormField)`
  grid-area: ${({ field }) => field.name};
`;

const AddOrEditForm = ({
  handleSubmit,
  values,
  touched,
  errors,
  setFieldTouched,
  setFieldValue,
}) => {
  return (
    <MissionForm id="addendaForm" onSubmit={handleSubmit}>
      <StyledFormField
        field={getField('workerId')}
        values={values}
        errors={errors}
        touched={touched}
        setFieldTouched={setFieldTouched}
        setFieldValue={setFieldValue}
      />
      <StyledFormField
        field={getField('dates')}
        values={values}
        errors={errors}
        touched={touched}
        setFieldTouched={setFieldTouched}
        setFieldValue={setFieldValue}
      />
      <StyledFormField
        field={getField('amount')}
        values={values}
        errors={errors}
        touched={touched}
        setFieldTouched={setFieldTouched}
        setFieldValue={setFieldValue}
      />
      <StyledFormField
        field={getField('unit')}
        values={values}
        errors={errors}
        touched={touched}
        setFieldTouched={setFieldTouched}
        setFieldValue={setFieldValue}
      />
      <StyledFormField
        field={getField('currency')}
        values={values}
        errors={errors}
        touched={touched}
        setFieldTouched={setFieldTouched}
        setFieldValue={setFieldValue}
      />
    </MissionForm>
  );
};

AddOrEditForm.propTypes = {
  handleSubmit: PropTypes.func.isRequired,
  values: PropTypes.object.isRequired,
  setFieldTouched: PropTypes.func.isRequired,
  setFieldValue: PropTypes.func.isRequired,
  errors: PropTypes.object.isRequired,
  touched: PropTypes.object.isRequired,
};

const componentLifecycle = {
  componentWillReceiveProps(nextProps) {
    const { clients, setFieldValue, setFieldTouched, values } = nextProps;
    if (!values.name && values.clientId && clients) {
      setFieldValue('name', clients[values.clientId].name);
      setFieldTouched('name', true);
    }
  },
};

export default compose(lifecycle(componentLifecycle))(AddOrEditForm);
