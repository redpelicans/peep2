import { filter, compose, reduce, toPairs, map } from 'ramda';

const getDomainIds = domainValues => map(x => x.id, domainValues || []);
const extendWithRequired = ({ label, required }) => rule =>
  required ? rule.required(`'${label}' is required!`) : rule;
const extendWithDomainValues = ({ domainValues }) => rule =>
  domainValues ? rule.oneOf(getDomainIds(domainValues)) : rule;
const makeValidationRule = field => {
  const { validate } = field;
  if (!validate) return;
  return reduce((acc, fn) => fn(acc), validate, [
    extendWithRequired(field),
    extendWithDomainValues(field),
  ]);
};

export const getOneValidationSchema = compose(
  reduce((acc, [name, field]) => ({ ...acc, [name]: field.validate }), {}),
  filter(([name, field]) => field.validate), // eslint-disable-line no-unused-vars
  toPairs,
  map(field => ({ ...field, validate: makeValidationRule(field) })),
);

// const defaultValueForType = type => {
//   switch(type = 'string') {
//   case 'number':
//       return 0;
//   case 'string':
//       return '';
//   }
// };

// const getDomainValue = (domainValues, valueId) =>
//   domainValues &&
//   valueId &&
//   reduce((acc, { id, value }) => ({ ...acc, [id]: value }), {}, domainValues)[
//     valueId
//   ];

export const getOneField = fields => name => ({ name, ...fields[name] });
export const getAllFields = compose(
  reduce((acc, [name, field]) => [...acc, { ...field, name }], []),
  toPairs,
);
export const getDefaultValues = compose(
  reduce((acc, [name, field]) => ({ ...acc, [name]: field.defaultValue }), {}),
  toPairs,
);
