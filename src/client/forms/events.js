import { map, compose, reduce, toPairs } from 'ramda';
import { DateField, InputTextField, WorkerSelectField } from '../fields';
import { getOneField, getAllFields } from './utils';

const fields = {
  startDate: {
    label: 'Start Date',
    component: DateField,
  },
  endDate: {
    label: 'End Date',
    component: DateField,
  },
  unit: {
    label: 'Unit',
    component: InputTextField,
  },
  value: {
    label: 'Value',
    component: InputTextField,
  },
  type: {
    label: 'Type',
    component: InputTextField,
  },
  worker: {
    label: 'Worker',
    component: WorkerSelectField,
  },
  status: {
    label: 'Status',
    component: InputTextField,
  },
  description: {
    label: 'Description',
    component: InputTextField,
  },
};

export const getField = getOneField(fields);
export default getAllFields(fields);
