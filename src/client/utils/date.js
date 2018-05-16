export const mockDate = () => {
  const DATE = new Date([2018, 1, 1]);
  const _Date = Date;
  global.Date = jest.fn(() => DATE);
  global.Date.now = _Date.now;
};
