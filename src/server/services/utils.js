import Yup from 'yup';
import R from 'ramda';
import { ObjectID } from 'mongodb';
import { Note } from '../models';

const ObjectSchema = Yup.mixed;
export class ObjectIdSchemaType extends ObjectSchema {
  constructor() {
    super();
    this.withMutation(() => {
      this.transform(function(value, originalvalue) {
        try {
          return new ObjectID(originalvalue);
        } catch (err) {
          return originalvalue;
        }
      });
      this.typeError('must be an ObjectID');
    });
  }

  _typeCheck(value) {
    return value ? ObjectID.isValid(value) : true;
  }
}

export const formatOutput = maker => ctx => {
  const { output } = ctx;
  return Promise.resolve({ ...ctx, output: maker(output) });
};

export const formatInput = maker => ctx => {
  const { input } = ctx;
  return Promise.resolve({ ...ctx, input: maker(input) });
};

export const validate = schema => ctx => {
  const { input } = ctx;
  return schema
    .validate(input, { strict: false, stripUnknown: true })
    .then(request => ({ ...ctx, input: request }));
};

export const checkUser = () => ctx => {
  if (ctx.user) return Promise.resolve(ctx);
  return Promise.reject({ code: 403, error: 'Forbidden access' });
};

export const emitEvent = name => ctx => {
  ctx.emit(name, ctx);
  return Promise.resolve(ctx);
};

export const emitAddNoteEvent = () => ctx => {
  const { output: { note, entity } } = ctx;
  const name = 'note:added';
  if (note) {
    ctx.evtx.service('notes').emit(name, {
      ...ctx,
      message: { broadcastAll: true, replyTo: name },
      output: note,
    });
  }
  return Promise.resolve({ ...ctx, output: entity });
};

export const emitNoteEvent = name => ctx => {
  const { output: { note } } = ctx;
  if (note) {
    ctx.evtx.service('notes').emit(name, {
      ...ctx,
      message: { broadcastAll: true, replyTo: name },
      output: note,
    });
  }
  return Promise.resolve(ctx);
};

export const emitNotesDeleted = () => ctx => {
  const { output: { _id } } = ctx;
  const name = 'notes:deleted';
  Note.loadAll({ entityId: _id, isDeleted: true }).then(notes => {
    if (!notes.length) return;
    ctx.evtx.service('notes').emit(name, {
      ...ctx,
      message: { broadcastAll: true, replyTo: name },
      output: R.pluck('_id', notes),
    });
  });
  return Promise.resolve(ctx);
};
