import { compose, reduce, toPairs } from 'ramda';
import fields from './companies';

const sortFieldsByRows = (sfields) => sfields;
const sortFieldsByColumns = (sfields) => sfields;

const exportedFields = compose(sortFieldsByColumns, sortFieldsByRows, reduce((acc, [name, r]) => [...acc, { ...r, name }], []), toPairs)(fields);
export default exportedFields;
