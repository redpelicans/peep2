import EventEmitter from 'events';

const isFunction = obj => typeof obj === 'function';
const reduceHooks = (ctx, hooks) => hooks.reduce((acc, hook) => acc.then(hook), Promise.resolve(ctx));

export class Service extends EventEmitter {
  constructor(definition, path, evtx) {
    super();
    this.path = path;
    this.evtx = evtx;
    this.beforeHooks = {};
    this.afterHooks = {};
    this.definition = definition;
    this.setup(definition);
  }

  setup(definition) {
    for (const key of Object.keys(definition)) {
      const value = definition[key];
      if (isFunction(value)) this.addMethod(key);
    }
  }

  getBeforeHooks(key = 'all') {
    return this.beforeHooks[key] || [];
  }

  getAfterHooks(key = 'all') {
    return this.afterHooks[key] || [];
  }

  addMethod(key) {
    this[key] = (input, globalContext) => {
      const message = { service: this.path, method: key, input };
      return this.evtx.run(message, globalContext);
    };
  }

  run(key, ctx) {
    const baseMethod = ctx => { // eslint-disable-line no-shadow
      const { method, service } = ctx;
      const methodObj = this.definition[method];
      if (!methodObj || !isFunction(methodObj)) throw new Error(`Unknown method: ${method} for service: ${service}`);
      return (methodObj.bind(ctx)(ctx.input)).then(data => ({ ...ctx, output: data }));
    };

    const execMethodMiddlewares = ctx => { // eslint-disable-line no-shadow
      const { method } = ctx;
      const hooks = [...this.getBeforeHooks(method), baseMethod, ...this.getAfterHooks(method)];
      return reduceHooks(ctx, hooks);
    };

    const hooks = [...this.getBeforeHooks(), execMethodMiddlewares, ...this.getAfterHooks()];
    return reduceHooks(ctx, hooks);
  }

  before(hooks) {
    this.beforeHooks = hooks;
    return this;
  }

  after(hooks) {
    this.afterHooks = hooks;
    return this;
  }
}

class EvtX {
  constructor(config) {
    this.services = {};
    this.config = config;
  }

  configure(fct) {
    fct(this);
    return this;
  }

  service(path) {
    return this.services[path];
  }

  use(path, service) {
    this.services[path] = new Service(service, path, this);
    return this;
  }

  before(...hooks) {
    this.beforeHooks = hooks;
    return this;
  }

  pushBefore(hook) {
    this.beforeHooks = [...this.getBeforeHooks(), hook];
    return this;
  }

  unshiftBefore(hook) {
    this.beforeHooks = [hook, ...this.getBeforeHooks()];
    return this;
  }

  pushAfter(hook) {
    this.afterHooks = [...this.getAfterHooks(), hook];
    return this;
  }

  unshiftAfter(hook) {
    this.afterHooks = [hook, ...this.getAfterHooks()];
    return this;
  }

  after(...hooks) {
    this.afterHooks = hooks;
    return this;
  }

  getBeforeHooks() {
    return this.beforeHooks || [];
  }

  getAfterHooks() {
    return this.afterHooks || [];
  }

  run(message, globalContext) {
    const execMethod = (ctx) => {
      const { service, method } = ctx;
      const evtXService = this.service(service);
      if (!evtXService) throw new Error(`Unknown service: ${service}`);
      const evtXMethod = evtXService[method];
      if (!evtXMethod || !isFunction(evtXMethod)) throw new Error(`Unknown method: ${method} for service: ${service}`);
      return evtXService.run(method, ctx);
    };
    const { service, method, input } = message;
    const ctx = {
      ...globalContext,
      message,
      service,
      method,
      input,
      output: {},
      evtx: this,
      emit(...params) {
        return this.evtx.service(this.service).emit(...params);
      },
    };

    const hooks = [...this.getBeforeHooks(), execMethod, ...this.getAfterHooks()];
    return reduceHooks(ctx, hooks).then(ctx => ctx.output); // eslint-disable-line no-shadow
  }
}

export default (config) => new EvtX(config);
