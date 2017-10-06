import should from 'should';
import { getLogin, getUser } from '../login';

describe('Selectors:login', () => {
  it('Should not get empty login object', () => {
    const user = 'toto';
    const state = {
      login: {
        user,
      },
    };
    const userFromState = getLogin(state);
    should(userFromState).eql(user);
  });
  it('Should get empty login object', () => {
    const state = {
      login: {},
    };
    const userFromState = getLogin(state);
    should(userFromState).eql(undefined);
  });
  it('Should get user name', () => {
    const user = 'toto';
    const state = {
      login: {
        user,
      },
    };
    const userFromState = getUser(state);
    should(userFromState).eql(user);
  });
  it('Should not get user name', () => {
    const state = {
      login: {},
    };
    const userFromState = getUser(state);
    should(userFromState).eql(undefined);
  });
});
