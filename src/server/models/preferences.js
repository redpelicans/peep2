import mongobless from 'mongobless';

@mongobless({ collection: 'preferences' })
export default class Preference {
  static loadAll(type, user) {
    return Preference.findAll({ personId: user._id, type });
  }

  static spread(type, user, entities = []) {
    return Preference.loadAll(type, user).then((preferences) => {
      const hpreferences = preferences.reduce((res, p) => { res[p.entityId] = true; return res; }, {}); // eslint-disable-line no-param-reassign
      entities.forEach((entity) => {
        entity.preferred = !!hpreferences[entity._id]; // eslint-disable-line no-param-reassign
        return entity;
      });
      return entities;
    });
  }

  static update(type, user, isPreferred, entity) {
    if (isPreferred) {
      return Preference.collection.update(
        { personId: user._id, entityId: entity._id },
        { personId: user._id, entityId: entity._id, type },
        { upsert: true }
      ).then(() => entity);
    }
    return Preference.collection.deleteMany({ personId: user._id, entityId: entity._id }).then(() => entity);
  }

  static delete(user, id) {
    return Preference.collection.deleteMany({ personId: user._id, entityId: id }).then(() => id);
  }
}
