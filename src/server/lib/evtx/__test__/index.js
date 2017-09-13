import should from 'should';
import EvtX, { Service } from '..';

const { describe, it } = global;

const sum = data => data.reduce((acc, v) => acc + v, 0);
const product = data => data.reduce((acc, v) => acc * v, 1);

const calculator = {
  name: 'calculator',
  sum(input) {
    return Promise.resolve({ result: sum(input) });
  },
  product(input) {
    return Promise.resolve({ result: product(input) });
  },
};

describe('EvtX', () => {
  it('should call right method',  (done) => {
    const evtx = EvtX().use(calculator.name, calculator);
    const message = { method: 'sum', service: calculator.name, input: [1, 2] };
    evtx
      .run(message)
      .then(res => { should(res.result).equal(3); done() })
      .catch(done);
  });

  it('should get a global context',  (done) => {
    const doit = {
      doit() {
        return Promise.resolve(this.key);
      },
    };

    const evtx = EvtX().use('doit', doit);
    const message = { method: 'doit', service: 'doit' };
    evtx
      .run(message, { key: 11 })
      .then(res => { should(res).equal(11); done() })
      .catch(done);
  });


  it('should emit an event',  (done) => {
    const add = {
      add({ id }) {
        this.emit('added', id);
        return Promise.resolve(id);
      },
    };

    const evtx = EvtX().use('add', add);
    evtx.service('add').on('added', (id) => {
      should(id).equal(1);
      done();
    })
    const message = { method: 'add', service: 'add', input: { id: 1 } };
    evtx
      .run(message)
      .catch(done);
  });


  it('should not call a method',  (done) => {
    const evtx = EvtX().use(calculator.name, calculator);
    const message = { };
    evtx
      .run(message)
      .then(res => done(new Error('Should be an error')))
      .catch(() => done());
  });

  it('should call service hooks',  (done) => {
    const incInput = (ctx) => {
      const { input } = ctx;
      return Promise.resolve({ ...ctx, input: input.map(x => x+1 ) });
    };

    const incResult = (ctx) => {
      const { output: { result } } = ctx;
      return Promise.resolve({ ...ctx, output: {result: result + 1 }});
    };
    const bhooks = { all: [incInput, incInput], sum: [incInput] };
    const ahooks = { all: [incResult, incResult], sum: [incResult] };

    const evtx = EvtX().use(calculator.name, calculator);
    evtx.service(calculator.name)
      .before(bhooks)
      .after(ahooks);

    const message = { method: 'sum', service: calculator.name, input: [1, 2] };
    evtx
      .run(message)
      .then(res => { should(res.result).equal(12); done() })
      .catch(done);
  });

  it('should change target service and method',  (done) => {
    const join = {
      name: 'join',
      join(input) {
        return Promise.resolve({ result: input.join('') });
      },
    };

    const changeService = (ctx) => Promise.resolve({ ...ctx, method: 'join', service: 'join' });
    const evtx = EvtX()
      .before(changeService)
      .use(calculator.name, calculator)
      .use(join.name, join);
    const message = { method: 'sum', service: calculator.name, input: [5, 7] };
    evtx
      .run(message)
      .then(res => { should(res.result).equal('57'); done() })
      .catch(done);
  });

  it('should change target method',  (done) => {
    const changeMethod = (ctx) => Promise.resolve({ ...ctx, method: 'product' });
    const evtx = EvtX().use(calculator.name, calculator);
    evtx.service(calculator.name).before({ all: [changeMethod] });
    const message = { method: 'sum', service: calculator.name, input: [5, 7] };
    evtx
      .run(message)
      .then(res => { should(res.result).equal(35); done() })
      .catch(done);
  });


  it('should call EvtX hooks',  (done) => {
    const incResult = (ctx) => {
      const { output: { result } } = ctx;
      return Promise.resolve({ ...ctx, output: { result: result + 1 }});
    };
    const changeMethod = (ctx) => Promise.resolve({ ...ctx, method: 'product' });
    const evtx = EvtX()
      .use(calculator.name, calculator)
      .before(changeMethod)
      .after(incResult);
    const message = { method: 'sum', service: calculator.name, input: [3, 2] };
    evtx
      .run(message)
      .then(res => { should(res.result).equal(7); done() })
      .catch(done);
  });

});

