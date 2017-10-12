import should from 'should';
import reducer from '../../reducers';
import { configureStore } from '../utils';
import { alert, ALERT } from '../message';

describe('Action:message', () => {
  it('ALERT Once', done => {
    const [TYPE, MESSAGE, DESCRIPTION] = ['type', 'message', 'description'];
    const hook = {
      [ALERT]: getState => {
        const { message } = getState();
        should(message.type).eql(TYPE);
        should(message.message).eql(MESSAGE);
        should(message.description).eql(DESCRIPTION);
        done();
      },
    };
    const store = configureStore(reducer, {}, hook);
    store.dispatch(
      alert({ type: TYPE, message: MESSAGE, description: DESCRIPTION }),
    );
  });
});
