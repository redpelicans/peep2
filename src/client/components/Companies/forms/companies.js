const fields = {
  types: {
    key: 'Types',
    label: 'Types',
    type: 'select',
    domainValues: ['Client', 'Partner', 'Tenant'],
    positon: 1.1,
    required: true,
  },
  name: {
    key: 'Name',
    label: 'Name',
    type: 'input',
    positon: 1.2,
    required: true,
  },
  website: {
    key: 'Website',
    label: 'Website',
    type: 'input',
    positon: 1.3,
    required: true,
  },
  street: {
    key: 'Street',
    label: 'Street',
    type: 'input',
    positon: 2.1,
    required: true,
  },
  zipcode: {
    key: 'Zipcode',
    label: 'Zip Code',
    type: 'input',
    positon: 2.2,
    required: true,
  },
  city: {
    key: 'City',
    label: 'City',
    type: 'select',
    positon: 3.1,
    required: true,
  },
  country: {
    key: 'Country',
    label: 'Country',
    type: 'select',
    positon: 3.2,
    required: true,
  },
  tags: {
    key: 'Tags',
    label: 'Tags',
    type: 'select',
    positon: 4.1,
    required: false,
  },
  notes: {
    key: 'Notes',
    label: 'Notes',
    type: 'textarea',
    positon: 5.1,
    required: false,
  },
};

export default fields;
