import { map, compose, reduce, toPairs } from 'ramda';
import { DateField, InputTextField, WorkerSelectField } from '../fields';

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

export const getField = name => ({ name, ...fields[name] });
export default compose(reduce((acc, [name, field]) => [...acc, { ...field, name }], []), toPairs)(fields);
