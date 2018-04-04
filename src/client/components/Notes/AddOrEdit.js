import React from 'react';
import PropTypes from 'prop-types';
import styled from 'styled-components';
import { isEmpty } from 'ramda';
import { FormField } from '../../fields';
import { getField } from '../../forms/notes';
import {
  PeopleSelectField,
  CompaniesSelectField,
} from '../../fields/SelectField';

const CompagnyForm = styled.form`
  display: grid;
  margin: auto;
  margin-top: 25px;
  margin-bottom: 25px;
  width: 90%;
  grid-gap: 20px;
  grid-auto-columns: minmax(70px, auto);
  grid-auto-rows: minmax(70px, auto);
  grid-template-areas: 'entityType' 'entityId' 'note' 'dueDate' 'assigneesIds';
  @media (min-width: 700px) {
    grid-template-areas: 'entityType entityId entityId' 'note note note'
      'dueDate assigneesIds assigneesIds';
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
  const getEntityIdComponent = value => {
    if (value === 'person') {
      return PeopleSelectField;
    } else if (value === 'company') {
      return CompaniesSelectField;
    } else {
      return;
    }
  };
  return (
    <CompagnyForm id="addNote" onSubmit={handleSubmit}>
      <StyledFormField
        field={getField('note')}
        values={values}
        errors={errors}
        touched={touched}
        setFieldTouched={setFieldTouched}
        setFieldValue={setFieldValue}
      />
      <StyledFormField
        field={getField('dueDate')}
        values={values}
        errors={errors}
        touched={touched}
        setFieldTouched={setFieldTouched}
        setFieldValue={setFieldValue}
      />
      <StyledFormField
        field={getField('assigneesIds')}
        values={values}
        errors={errors}
        touched={touched}
        setFieldTouched={setFieldTouched}
        setFieldValue={setFieldValue}
      />
      <StyledFormField
        field={getField('entityType')}
        values={values}
        errors={errors}
        touched={touched}
        onChange={e => {
          e
            ? setFieldValue('entityType', e.value)
            : setFieldValue('entityType', '');
          if (values.entityId) setFieldValue('entityId', '');
          setFieldTouched('entityType', true);
        }}
      />
      {!isEmpty(values.entityType) &&
        values.entityType !== undefined && (
          <StyledFormField
            field={{
              ...getField('entityId'),
              label: values.entityType,
              component: getEntityIdComponent(values.entityType),
              required: true,
            }}
            values={values}
            errors={errors}
            touched={touched}
            disabled={values.entityType === 'none' ? true : false}
            setFieldTouched={setFieldTouched}
            setFieldValue={setFieldValue}
          />
        )}
    </CompagnyForm>
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

export default AddOrEditForm;
