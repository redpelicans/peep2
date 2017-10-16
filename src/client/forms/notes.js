import Yup from 'yup';
import { getDefaultValues, getOneValidationSchema, getOneField } from './utils';
import { InputField } from '../fields';
import {
  SelectField,
  WorkerSelectField,
  CompaniesSelectField,
} from '../fields/SelectField';
import { DateField } from '../fields/DateField';
import { MarkDownField } from '../fields/MarkDownField';

const fields = {
  note: {
    label: 'Notes',
    component: MarkDownField,
  },
  dueDate: {
    label: 'Due Date',
    component: DateField,
  },
  delay: {
    label: 'Delay',
    component: InputField,
  },
  unit: {
    label: 'Unit',
    component: SelectField,
    domainValues: [
      { id: 'minute', value: 'Minute' },
      { id: 'hour', value: 'Hour' },
      { id: 'day', value: 'Day' },
      { id: 'week', value: 'Week' },
      { id: 'month', value: 'Month' },
    ],
  },
  assignees: {
    label: 'Assignees',
    component: WorkerSelectField,
  },
  entityType: {
    label: 'EntityType',
    component: SelectField,
    defaultValue: 'none',
    domainValues: [
      { id: 'none', value: '<None>' },
      { id: 'company', value: 'Company' },
      { id: 'mission', value: 'Mission' },
      { id: 'person', value: 'Person' },
    ],
  },
  entity: {
    label: 'Entity',
    component: InputField,
  },
  companyId: {
    label: 'Company',
    required: true,
    component: CompaniesSelectField,
    validate: Yup.string(),
  },
};

export const defaultValues = getDefaultValues(fields);
export const getField = getOneField(fields);
export const getValidationSchema = extend =>
  Yup.object().shape(getOneValidationSchema(fields, extend));
