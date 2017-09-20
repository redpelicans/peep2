import config from "../../../../params";
import { Person } from "..";
import { connect, close, drop, load } from "../../utils/tests";

const data = {
  collections: {
    people: [
      {
        _id: 1,
        firstName: "A",
        lastName: "lastName1",
        roles: ["admin", "role1", "role2"],
        type: "worker",
        _fullName: "A lastName1"
      },
      {
        firstName: "B",
        lastName: "lastName1"
      },
      {
        firstName: "C",
        lastName: "lastName1"
      },
      {
        isDeleted: true,
        firstName: "D",
        lastName: "lastName1"
      }
    ]
  }
};

const ctx = {};
beforeAll(() => connect(config.db).then(db => (ctx.db = db)));
afterAll(close);

describe("People models", () => {
  beforeEach(() => drop(ctx.db).then(() => load(ctx.db, data)));

  it("expect find all", done => {
    Person.loadAll()
      .then(people => {
        const names = people.map(person => person.firstName).join("");
        const res = data.collections.people
          .filter(person => !person.isDeleted)
          .map(person => person.firstName)
          .join("");
        expect(names).toEqual(res);
        done();
      })
      .catch(done);
  });

  it("expect load all", done => {
    Person.loadAll({ firstName: "B" })
      .then(people => {
        const names = people.map(person => person.firstName).join("");
        expect(names).toEqual("B");
        done();
      })
      .catch(done);
  });

  it("expect load one", done => {
    const { _id, _fullName, roles } = data.collections.people[0];
    Person.loadOne(_id)
      .then(person => {
        expect(person._id).toEqual(_id);
        expect(person.fullName()).toEqual(_fullName);
        expect(person.isAdmin()).true();
        expect(person.isWorker()).true();
        expect(person.hasSomeRoles(["role1", "admin", "toto"])).true();
        expect(person.hasAllRoles(["role1", "admin"])).true();
        expect(person.hasAllRoles(["role1", "admin", "toto"])).false();
        expect(person.hasAllRoles([])).true();
        expect(person.hasSomeRoles()).true();
        done();
      })
      .catch(done);
  });

  it("expect find one", done => {
    const firstName = data.collections.people[0].firstName;
    Person.findOne({ firstName })
      .then(person => {
        expect(person.firstName).toEqual(firstName);
        done();
      })
      .catch(done);
  });
});
