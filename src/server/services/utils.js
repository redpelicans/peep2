export const formatOutput = maker => (ctx) => {
  const { output } = ctx;
  return Promise.resolve({ ...ctx, output: maker(output) });
};

export const formatInput = maker => (ctx) => {
  const { input } = ctx;
  return Promise.resolve({ ...ctx, input: maker(input) });
};

export const checkUser = () => (ctx) => {
  if (ctx.user) return Promise.resolve(ctx);
  return Promise.reject({ code: 403, error: 'Forbidden access' });
};

export const emitEvent = name => ctx => {
  ctx.emit(name, ctx);
  return Promise.resolve(ctx);
};
