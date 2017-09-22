import { compose, reduce, toPairs } from 'ramda';
import fields from './companies';

// const sortFieldsByRows = sfields => groupBy(prop('row'), sfields);
// const sortFieldsByColumns = sfields => map(row => , sfields);

const exportedFields = compose(reduce((acc, [name, r]) => [...acc, { ...r, name }], []), toPairs)(fields);
export default exportedFields;
