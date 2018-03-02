/* eslint-disable no-param-reassign, no-shadow */

import debug from 'debug';
import Yup from 'yup';
import R from 'ramda';
import { ObjectId } from 'mongobless';
import { Addenda } from '../models';
import {
  checkUser,
  emitEvent,
  formatOutput,
  ObjectIdSchemaType,
  validate,
} from './utils';

const loginfo = debug('peep:evtx');
const SERVICE_NAME = 'addenda';

const addSchema = Yup.object().shape({
  missionId: new ObjectIdSchemaType().required(),
  workerId: new ObjectIdSchemaType().required(),
  startDate: Yup.date().required(),
  endDate: Yup.date().nullable(),
  fees: Yup.object().shape({
    amount: Yup.number().required(),
    unit: Yup.string()
      .oneOf(['day'])
      .required(),
    currency: Yup.string()
      .oneOf(['EUR'])
      .required(),
  }),
});

const updateSchema = addSchema.concat(
  Yup.object().shape({
    _id: new ObjectIdSchemaType().required(),
  }),
);

const deleteSchema = Yup.object().shape({
  _id: new ObjectIdSchemaType().required(),
});

const inMaker = input => {
  return input;
};

export const addenda = {
  load() {
    return Addenda.loadAll();
  },

  add(input) {
    const newAddendum = inMaker(input);
    newAddendum.createdAt = new Date();
    const insertOne = p =>
      Addenda.collection.insertOne(p).then(R.prop('insertedId'));
    const loadOne = id => Addenda.loadOne(id);
    return insertOne(newAddendum).then(loadOne);
  },

  update(addendum) {
    console.log('addendum', addendum);
    const newVersion = inMaker(addendum);
    newVersion.updatedAt = new Date();
    const loadOne = ({ _id }) => Addenda.loadOne(_id);
    const update = nextVersion => previousVersion => {
      return Addenda.collection
        .updateOne(
          { _id: previousVersion._id },
          { $set: { ...nextVersion, updatedAt: new Date() } },
        )
        .then(() => ({ _id: previousVersion._id }));
    };
    return loadOne(newVersion)
      .then(update(newVersion))
      .then(loadOne);
  },

  del({ _id }) {
    const deleteOne = () =>
      Addenda.collection.updateOne(
        { _id },
        { $set: { updatedAt: new Date(), isDeleted: true } },
      );
    return deleteOne().then(() => ({ _id }));
  },
};

const outMaker = addendum => {
  return addendum;
};

export const outMakerMany = R.map(outMaker);

const init = evtx => {
  evtx.use(SERVICE_NAME, addenda);
  evtx
    .service(SERVICE_NAME)
    .before({
      all: [checkUser()],
      add: [validate(addSchema)],
      update: [validate(updateSchema)],
      del: [validate(deleteSchema)],
    })
    .after({
      load: [formatOutput(outMakerMany)],
      add: [formatOutput(outMaker), emitEvent('addendum:added')],
      update: [formatOutput(outMaker), emitEvent('addendum:updated')],
      del: [emitEvent('addendum:deleted')],
    });

  loginfo('addenda service registered');
};

export default init;

/* eslint-disable no-param-reassign, no-shadow */
