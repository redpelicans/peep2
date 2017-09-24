import { compose, reduce, toPairs } from 'ramda';
import fields from './companies';

const exportedFields = compose(reduce((acc, [name, r]) => [...acc, { ...r, name }], []), toPairs)(fields);
export default exportedFields;
