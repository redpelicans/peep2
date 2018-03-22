import React from 'react';
import PropTypes from 'prop-types';
import { compose, lifecycle } from 'recompose';
import { isNil } from 'ramda';
import styled from 'styled-components';
import { FormField } from '../../fields';
import { getField } from '../../forms/people';
import { ViewField } from '../widgets';

const PeopleForm = styled.form`
  display: grid;
  margin: auto;
  margin-top: 25px;
  margin-bottom: 25px;
  width: 90%;
  grid-gap: 20px;
  grid-auto-columns: minmax(70px, auto);
  grid-auto-rows: minmax(70px, auto);
  grid-template-areas: 'prefix' 'firstName' 'lastName' 'type' 'email' 'jobType'
    'companyId' 'phones' 'tags' 'roles' 'note';
  @media (min-width: 700px) {
    grid-template-areas: 'prefix firstName lastName' 'type email jobType'
      'companyId companyId companyId' 'phones phones phones' 'tags tags tags'
      'roles roles roles' 'note note note';
  }
`;

const StyledViewField = styled(ViewField)`grid-area: ${({ name }) => name};`;

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
  type,
  redpelicans,
  companyId,
}) => {
  return (
    <PeopleForm id="peopleForm" onSubmit={handleSubmit}>
      <StyledFormField
        field={getField('prefix')}
        values={values}
        errors={errors}
        touched={touched}
        setFieldTouched={setFieldTouched}
        setFieldValue={setFieldValue}
      />
      <StyledFormField
        field={getField('firstName')}
        values={values}
        errors={errors}
        touched={touched}
        setFieldTouched={setFieldTouched}
        setFieldValue={setFieldValue}
      />
      <StyledFormField
        field={getField('lastName')}
        values={values}
        errors={errors}
        touched={touched}
        setFieldTouched={setFieldTouched}
        setFieldValue={setFieldValue}
      />
      <StyledFormField
        field={getField('type')}
        values={values}
        errors={errors}
        touched={touched}
        setFieldTouched={setFieldTouched}
        setFieldValue={setFieldValue}
      />
      <StyledFormField
        field={getField('email')}
        values={values}
        errors={errors}
        touched={touched}
        setFieldTouched={setFieldTouched}
        setFieldValue={setFieldValue}
      />
      <StyledFormField
        field={getField('jobType')}
        values={values}
        errors={errors}
        touched={touched}
        setFieldTouched={setFieldTouched}
        setFieldValue={setFieldValue}
      />
      {values.type === 'worker' ? (
        <StyledViewField
          name="companyId"
          label="Company"
          value={redpelicans && redpelicans.name}
        />
      ) : (
        <StyledFormField
          field={getField('companyId')}
          disabled={!isNil(companyId)}
          values={values}
          touched={touched}
          errors={errors}
          creatable={true}
          clearable={true}
          setFieldTouched={setFieldTouched}
          setFieldValue={setFieldValue}
        />
      )}
      <StyledFormField
        field={getField('phones')}
        values={values}
        touched={touched}
        errors={errors}
        setFieldTouched={setFieldTouched}
        setFieldValue={setFieldValue}
      />
      <StyledFormField
        field={getField('tags')}
        values={values}
        touched={touched}
        errors={errors}
        setFieldTouched={setFieldTouched}
        setFieldValue={setFieldValue}
        creatable={true}
      />
      <StyledFormField
        field={getField('roles')}
        values={values}
        errors={errors}
        touched={touched}
        setFieldTouched={setFieldTouched}
        setFieldValue={setFieldValue}
        multi={true}
      />
      {type === 'add' && (
        <StyledFormField
          field={getField('note')}
          values={values}
          errors={errors}
          touched={touched}
          setFieldTouched={setFieldTouched}
          setFieldValue={setFieldValue}
        />
      )}
    </PeopleForm>
  );
};

AddOrEditForm.propTypes = {
  handleSubmit: PropTypes.func.isRequired,
  values: PropTypes.object.isRequired,
  setFieldTouched: PropTypes.func.isRequired,
  setFieldValue: PropTypes.func.isRequired,
  errors: PropTypes.object.isRequired,
  touched: PropTypes.object.isRequired,
  type: PropTypes.string.isRequired,
  redpelicans: PropTypes.object,
  companyId: PropTypes.string,
};

const componentLifecycle = {
  componentWillReceiveProps(nextProps) {
    const { setFieldValue, setFieldTouched, values, redpelicans } = nextProps;
    const { values: previousValues } = this.props;
    if (values.type === 'worker' && previousValues.type !== 'worker') {
      setFieldValue('companyId', redpelicans._id);
      setFieldTouched('companyId', true);
    } else if (values.type !== 'worker' && previousValues.type === 'worker') {
      setFieldValue('companyId', null);
      setFieldTouched('companyId', true);
    }
  },
};

export default compose(lifecycle(componentLifecycle))(AddOrEditForm);
