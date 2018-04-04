import Yup from 'yup';
import { getDefaultValues, getOneValidationSchema, getOneField } from './utils';
import { SelectField, AssigneesSelectField } from '../fields/SelectField';
import { DateField } from '../fields/DateField';
import { MarkDownField } from '../fields/MarkDownField';

const fields = {
  note: {
    label: 'Notes',
    component: MarkDownField,
    validate: Yup.string(),
    required: true,
  },
  dueDate: {
    label: 'Due Date',
    component: DateField,
  },
  assigneesIds: {
    label: 'Assignees',
    component: AssigneesSelectField,
  },
  entityType: {
    label: 'EntityType',
    component: SelectField,
    defaultValue: undefined,
    domainValues: [
      { id: 'company', value: 'Company' },
      { id: 'person', value: 'Person' },
    ],
    validate: Yup.string().nullable(),
  },
  entityId: {
    validate: Yup.string()
      .nullable()
      .when(
        'entityType',
        (entityType, schema) =>
          entityType !== undefined ? schema.required() : schema,
      ),
  },
};

export const defaultValues = getDefaultValues(fields);
export const getField = getOneField(fields);
export const getValidationSchema = extend => {
  return Yup.object().shape(getOneValidationSchema(fields, extend));
};
