import Yup from 'yup';
import { getDefaultValues, getOneValidationSchema, getOneField } from './utils';
import { InputField } from '../fields';
import { SelectField } from '../fields/SelectField';
import { MarkDownField } from '../fields/MarkDownField';

const fields = {
  note: {
    label: 'Notes',
    component: MarkDownField,
  },
  dueDate: {
    label: 'Due Date',
    component: InputField,
  },
  delay: {
    label: 'Delay',
    component: InputField,
  },
  unit: {
    label: 'Unit',
    component: InputField,
  },
  assignees: {
    label: 'Assignees',
    component: InputField,
  },
  entityType: {
    label: 'EntityType',
    component: InputField,
  },
  entity: {
    label: 'Entity',
    component: InputField,
  },
};

export const defaultValues = getDefaultValues(fields);
export const getField = getOneField(fields);
export const getValidationSchema = extend =>
  Yup.object().shape(getOneValidationSchema(fields, extend));
