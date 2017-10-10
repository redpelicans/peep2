import Yup from 'yup';
import { ObjectId } from 'mongobless';

const ObjectSchema = Yup.object;
export class ObjectIdSchemaType extends ObjectSchema {
  constructor() {
    super();
    this.withMutation(() => {
      this.transform(function(value, originalvalue) {
        try {
          return ObjectId(originalvalue);
        } catch (err) {
          return originalvalue;
        }
      });
      this.typeError("'_id' must be an ObjectID");
    });
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
