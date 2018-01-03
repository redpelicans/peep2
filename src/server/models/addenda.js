import mongobless from 'mongobless';
import R from 'ramda';

@mongobless({ collection: 'addenda' })
export default class Addenda {
  static loadOne(id) {
    return Addenda.findOne({ isDeleted: { $ne: true }, _id: id });
  }

  static loadAll(query, ...params) {
    const baseQuery = { isDeleted: { $in: [null, false] } };
    return Addenda.findAll(R.merge(baseQuery, query), ...params);
  }
}
