import R from 'ramda';
import sinon from 'sinon';
import { ObjectId } from 'mongobless';
import evtX from 'evtx';
import params from '../../../../params';
import initCompanies, { company } from '../companies';
import initNotes from '../notes';
import { Company, Preference, Note } from '../../models';
import { manageError, connect, close, drop } from '../../utils/tests';

const evtx = evtX()
  .configure(initCompanies)
  .configure(initNotes);
const service = evtx.service('companies');

const data = {
  collections: {
    preferences: [
      {
        personId: 0,
        entityId: 2,
        type: 'company',
      },
      {
        personId: 0,
        entityId: 3,
        type: 'company',
      },
    ],
    companies: [
      {
        _id: 1,
        _isPreferred: false,
      },
      {
        _id: 2,
        _isPreferred: true,
      },
      {
        _id: 3,
        _isPreferred: true,
      },
    ],
  },
};

let db;
beforeAll(() => connect(params.db).then(ctx => (db = ctx)));
afterAll(close);

describe('Companies service', () => {
  beforeEach(() => drop(db));

  it('expect load', () => {
    const companyStub = sinon
      .stub(Company, 'loadAll')
      .callsFake(() => Promise.resolve(data.collections.companies));
    const preferenceStub = sinon
      .stub(Preference, 'findAll')
      .callsFake(() => Promise.resolve(data.collections.preferences));
    const end = e => {
      companyStub.restore();
      preferenceStub.restore();
      manageError(e);
    };
    return company.load.bind({ user: { _id: 0 } })()
      .then(companies => {
        companies.forEach(p => expect(p.preferred === p._isPreferred));
        end();
      })
      .catch(end);
  });

  it('expect delete', () => {
    const company = {
      name: 'C1',
      type: 'client',
      avatar: { color: 'red' },
      preferred: true,
      note: 'note1',
    };
    const user = { _id: 0 };
    const checkCompany = ({ _id }) =>
      Company.findOne({ _id }).then(company => {
        expect(company.isDeleted).toBe(true);
        return company._id;
      });
    const checkNote = id =>
      Note.loadAllForEntity({ _id: id }).then(notes => {
        expect(notes.length).toEqual(0);
        return id;
      });

    return service
      .add(company, { user })
      .then(({ _id }) => service.del({ _id }, { user }))
      .then(checkCompany)
      .then(checkNote)
      .catch(manageError);
  });

  it('expect add', () => {
    const newCompany = {
      name: 'C1',
      __trash__: 1,
      type: 'client',
      address: {
        street: 'street',
        city: 'city',
        __trash__: 1,
      },
      avatar: {
        color: 'color',
        __trash__: 1,
      },
      tags: ['TAG1', 'TAG1', 'TAG2'],
      note: 'note',
    };
    const user = { _id: 0 };
    const checkCompany = company => {
      const res = {
        name: 'C1',
        type: 'client',
        address: { street: 'street', city: 'city' },
        avatar: { color: 'color' },
        tags: ['Tag1', 'Tag2'],
        authorId: 0,
      };
      expect(
        R.omit(['_id', 'createdAt', 'constructor', 'note'], company),
      ).toEqual(res);
      return company;
    };
    const checkNote = company =>
      Note.loadAllForEntity(company).then(notes => {
        expect(notes[0].entityId).toEqual(company._id);
        expect(notes[0].content).toEqual(newCompany.note);
        return company;
      });
    return service
      .add(newCompany, { user })
      .then(checkCompany)
      .then(checkNote)
      .catch(manageError);
  });

  it('expect update', () => {
    const newCompany = {
      name: 'C1',
      type: 'client',
      address: { street: 'street', city: 'city' },
      avatar: { color: 'color' },
      tags: ['TAG1', 'TAG1', 'TAG2'],
      note: 'note',
      preferred: true,
    };
    const updatedCompany = {
      name: 'C2',
      type: 'tenant',
      address: { street: 'street2', city: 'city2' },
      tags: ['TAG1', 'TAG3'],
      preferred: false,
      avatar: { color: 'red' },
    };

    const user = { _id: 0 };
    const checkCompany = company => {
      const res = {
        name: 'C2',
        type: 'tenant',
        address: { street: 'street2', city: 'city2' },
        tags: ['Tag1', 'Tag3'],
        avatar: { color: 'red' },
        authorId: 0,
      };
      expect(
        R.omit(
          ['_id', 'note', 'updatedAt', 'createdAt', 'constructor'],
          company,
        ),
      ).toEqual(res);
      return company;
    };

    return service
      .add(newCompany, { user })
      .then(c => service.update({ _id: c._id, ...updatedCompany }, { user }))
      .then(checkCompany)
      .catch(manageError);
  });
});
