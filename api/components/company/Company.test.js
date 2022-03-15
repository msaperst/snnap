const Company = require('./Company');

jest.mock('../../services/Mysql');
const Mysql = require('../../services/Mysql');

describe('Company', () => {
  beforeEach(() => {
    jest.clearAllMocks();
    jest.resetAllMocks();
  });

  it('will get basic company info', async () => {
    const spy = jest.spyOn(Mysql, 'query');
    Mysql.query
      .mockResolvedValueOnce([{ id: 1 }])
      .mockResolvedValueOnce([{ id: 1 }])
      .mockResolvedValueOnce([]);
    const company = new Company(1);
    expect(await company.getInfo()).toEqual({ id: 1, portfolio: [] });
    expect(company.userId).toEqual('1');
    expect(company.companyId).toEqual(1);
    expect(spy).toHaveBeenCalledTimes(3);
    expect(spy).toHaveBeenNthCalledWith(
      1,
      'SELECT * FROM companies WHERE user = 1;'
    );
    expect(spy).toHaveBeenNthCalledWith(
      2,
      'SELECT * FROM companies WHERE user = 1;'
    );
    expect(spy).toHaveBeenNthCalledWith(
      3,
      'SELECT * FROM portfolio WHERE company = 1;'
    );
  });

  it('will create the company if empty', async () => {
    const spy = jest.spyOn(Mysql, 'query');
    Mysql.query
      .mockResolvedValueOnce([])
      .mockResolvedValueOnce({ insertId: 2 })
      .mockResolvedValueOnce([{ id: 2, user: 5 }])
      .mockResolvedValueOnce([]);
    const company = new Company(5);
    expect(await company.getInfo()).toEqual({ id: 2, user: 5, portfolio: [] });
    expect(company.userId).toEqual('5');
    expect(company.companyId).toEqual(2);
    expect(spy).toHaveBeenCalledTimes(4);
    expect(spy).toHaveBeenNthCalledWith(
      1,
      'SELECT * FROM companies WHERE user = 5;'
    );
    expect(spy).toHaveBeenNthCalledWith(
      2,
      'INSERT INTO companies (user) VALUE (5);'
    );
    expect(spy).toHaveBeenNthCalledWith(
      3,
      'SELECT * FROM companies WHERE user = 5;'
    );
    expect(spy).toHaveBeenNthCalledWith(
      4,
      'SELECT * FROM portfolio WHERE company = 2;'
    );
  });

  it('creates the portfolio without any portfolio items', async () => {
    const spy = jest.spyOn(Mysql, 'query');
    Mysql.query
      .mockResolvedValueOnce([{ id: 3 }])
      .mockResolvedValueOnce([])
      .mockResolvedValueOnce([]);
    const company = new Company(2);
    await company.setPortfolio('experience', []);
    expect(company.userId).toEqual('2');
    expect(company.companyId).toEqual(3);
    expect(spy).toHaveBeenCalledTimes(3);
    expect(spy).toHaveBeenNthCalledWith(
      1,
      'SELECT * FROM companies WHERE user = 2;'
    );
    expect(spy).toHaveBeenNthCalledWith(
      2,
      "UPDATE companies SET experience = 'experience' WHERE user = 2"
    );
    expect(spy).toHaveBeenNthCalledWith(
      3,
      'DELETE FROM portfolio WHERE company = 3;'
    );
  });

  it('creates the portfolio with portfolio items', async () => {
    const spy = jest.spyOn(Mysql, 'query');
    Mysql.query
      .mockResolvedValueOnce([{ id: 3 }])
      .mockResolvedValueOnce([])
      .mockResolvedValueOnce([]);
    const company = new Company(2);
    await company.setPortfolio('experience', [
      { description: 'description1', link: 'link1' },
      {},
      { description: 'description2', link: 'link2' },
      { description: 'description3' },
      { link: 'link4' },
    ]);
    expect(company.userId).toEqual('2');
    expect(company.companyId).toEqual(3);
    expect(spy).toHaveBeenCalledTimes(5);
    expect(spy).toHaveBeenNthCalledWith(
      1,
      'SELECT * FROM companies WHERE user = 2;'
    );
    expect(spy).toHaveBeenNthCalledWith(
      2,
      "UPDATE companies SET experience = 'experience' WHERE user = 2"
    );
    expect(spy).toHaveBeenNthCalledWith(
      3,
      'DELETE FROM portfolio WHERE company = 3;'
    );
    expect(spy).toHaveBeenNthCalledWith(
      4,
      "INSERT INTO portfolio (company, link, description) VALUES (3, 'link1', 'description1');"
    );
    expect(spy).toHaveBeenNthCalledWith(
      5,
      "INSERT INTO portfolio (company, link, description) VALUES (3, 'link2', 'description2');"
    );
  });
});
