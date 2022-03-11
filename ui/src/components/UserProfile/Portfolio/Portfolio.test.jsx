import React from 'react';
import { fireEvent, render } from '@testing-library/react';
import '@testing-library/jest-dom';
import Adapter from '@wojtekmaj/enzyme-adapter-react-17';
import Enzyme from 'enzyme';
import { act } from 'react-dom/test-utils';
import Portfolio from './Portfolio';

jest.mock('../../../services/user.service');
const userService = require('../../../services/user.service');

Enzyme.configure({ adapter: new Adapter() });

describe('portfolio', () => {
  jest.setTimeout(10000);

  beforeEach(() => {
    jest.clearAllMocks();
    jest.resetAllMocks();
  });

  it('renders nothing when no values are passed', () => {
    const { container } = render(<Portfolio />);
    expect(container.children).toHaveLength(0);
  });

  it('renders nothing without an experience', () => {
    const { container } = render(<Portfolio portfolio={[]} />);
    expect(container.children).toHaveLength(0);
  });

  it('renders nothing without a portfolio', () => {
    const { container } = render(<Portfolio companyExperience="" />);
    expect(container.children).toHaveLength(0);
  });

  it('renders header properly', () => {
    const { container } = render(
      <Portfolio companyExperience="" portfolio={[]} />
    );
    expect(container.children).toHaveLength(1);
    expect(container.firstChild.getAttribute('noValidate')).toEqual('');
    expect(container.firstChild.children).toHaveLength(3);
    expect(container.firstChild.firstChild).toHaveTextContent('Portfolio');
  });

  it('renders multiple portfolios properly', () => {
    const { container } = render(
      <Portfolio companyExperience="" portfolio={[{}, {}, {}]} />
    );
    expect(container.children).toHaveLength(1);
    expect(container.firstChild.getAttribute('noValidate')).toEqual('');
    expect(container.firstChild.children).toHaveLength(6);
    expect(container.firstChild.firstChild).toHaveTextContent('Portfolio');
  });

  it('has empty experience in the first row', () => {
    const { container } = render(
      <Portfolio companyExperience="" portfolio={[{}]} />
    );
    expect(container.firstChild.children[1].lastChild).toHaveClass('col-md-12');
    expect(container.firstChild.children[1].lastChild.children).toHaveLength(1);
    expect(container.firstChild.children[1].lastChild.firstChild).toHaveClass(
      'form-floating'
    );
    expect(
      container.firstChild.children[1].lastChild.firstChild.firstChild.getAttribute(
        'id'
      )
    ).toEqual('formExperience');
    expect(
      container.firstChild.children[1].lastChild.firstChild.firstChild.getAttribute(
        'type'
      )
    ).toEqual('textarea');
    expect(
      container.firstChild.children[1].lastChild.firstChild.firstChild
    ).toHaveTextContent('');
    // the rest is verified in SnnapFormInput.test.jsx
  });

  it('has experience in the first row', () => {
    const { container } = render(
      <Portfolio companyExperience="Some experience" portfolio={[{}]} />
    );
    expect(container.firstChild.children[1].lastChild).toHaveClass('col-md-12');
    expect(container.firstChild.children[1].lastChild.children).toHaveLength(1);
    expect(container.firstChild.children[1].lastChild.firstChild).toHaveClass(
      'form-floating'
    );
    expect(
      container.firstChild.children[1].lastChild.firstChild.firstChild.getAttribute(
        'id'
      )
    ).toEqual('formExperience');
    expect(
      container.firstChild.children[1].lastChild.firstChild.firstChild.getAttribute(
        'type'
      )
    ).toEqual('textarea');
    expect(
      container.firstChild.children[1].lastChild.firstChild.firstChild
    ).toHaveTextContent('Some experience');
    // the rest is verified in SnnapFormInput.test.jsx
  });

  it('has 2 items in the second row', () => {
    const { container } = render(
      <Portfolio companyExperience="" portfolio={[{}]} />
    );
    expect(container.firstChild.children[2]).toHaveClass('mb-3 row');
    expect(container.firstChild.children[2].children).toHaveLength(2);
  });

  it('has description in the second row', () => {
    const { container } = render(
      <Portfolio
        companyExperience=""
        portfolio={[{ description: 'description1' }]}
      />
    );
    expect(container.firstChild.children[2].firstChild).toHaveClass(
      'col-md-12'
    );
    expect(container.firstChild.children[2].firstChild.children).toHaveLength(
      1
    );
    expect(container.firstChild.children[2].firstChild.firstChild).toHaveClass(
      'form-floating'
    );
    expect(
      container.firstChild.children[2].firstChild.firstChild.firstChild.getAttribute(
        'id'
      )
    ).toEqual('0:Description');
    expect(
      container.firstChild.children[2].firstChild.firstChild.firstChild.getAttribute(
        'type'
      )
    ).toEqual('textarea');
    expect(
      container.firstChild.children[2].firstChild.firstChild.firstChild
    ).toHaveTextContent('description1');
    // the rest is verified in SnnapFormInput.test.jsx
  });

  it('has link in the second row', () => {
    const { container } = render(
      <Portfolio companyExperience="" portfolio={[{ link: 'link1' }]} />
    );
    expect(container.firstChild.children[2].lastChild).toHaveClass('col-md-12');
    expect(container.firstChild.children[2].lastChild.children).toHaveLength(1);
    expect(container.firstChild.children[2].lastChild.firstChild).toHaveClass(
      'form-floating'
    );
    expect(
      container.firstChild.children[2].lastChild.firstChild.firstChild.getAttribute(
        'id'
      )
    ).toEqual('0:Link');
    expect(
      container.firstChild.children[2].lastChild.firstChild.firstChild.getAttribute(
        'type'
      )
    ).toEqual('text');
    expect(
      container.firstChild.children[2].lastChild.firstChild.firstChild.getAttribute(
        'value'
      )
    ).toEqual('link1');
    // the rest is verified in SnnapFormInput.test.jsx
  });

  it('has 2 items in the last row', () => {
    const { container } = render(
      <Portfolio companyExperience="" portfolio={[{}]} />
    );
    expect(container.firstChild.lastChild).toHaveClass('mb-3 row');
    expect(container.firstChild.lastChild.children).toHaveLength(2);
  });

  it('has save information button in the last row', () => {
    const { container } = render(
      <Portfolio companyExperience="" portfolio={[{}]} />
    );
    expect(container.firstChild.lastChild.firstChild).toHaveClass('col');
    expect(container.firstChild.lastChild.firstChild.firstChild).toHaveClass(
      'btn btn-primary'
    );
    expect(
      container.firstChild.lastChild.firstChild.firstChild.getAttribute('id')
    ).toEqual('savePortfolioButton');
    expect(
      container.firstChild.lastChild.firstChild.firstChild.getAttribute('type')
    ).toEqual('submit');
    expect(
      container.firstChild.lastChild.firstChild.firstChild
    ).toHaveTextContent('Save Portfolio');
  });

  it('has no alert or update present in the last row', () => {
    const { container } = render(
      <Portfolio companyExperience="" portfolio={[{}]} />
    );
    expect(container.firstChild.lastChild.lastChild).toHaveClass('col');
    expect(container.firstChild.lastChild.lastChild.children).toHaveLength(0);
  });

  it('does not submit if values are not present/valid', async () => {
    const { container } = render(
      <Portfolio companyExperience="" portfolio={[{}]} />
    );
    await fireEvent.click(container.firstChild.lastChild.firstChild.firstChild);
    expect(container.firstChild.lastChild.lastChild).toHaveClass('col');
    expect(container.firstChild.lastChild.lastChild.children).toHaveLength(0);
  });

  it('does not submit if partial portfolio values are present', async () => {
    const { container } = render(
      <Portfolio
        companyExperience="experience"
        portfolio={[{ description: 'some description' }]}
      />
    );
    await fireEvent.click(container.firstChild.lastChild.firstChild.firstChild);
    expect(container.firstChild.lastChild.lastChild).toHaveClass('col');
    expect(container.firstChild.lastChild.lastChild.children).toHaveLength(0);
  });

  it('has an alert on failure of a submission', async () => {
    const spy = jest.spyOn(userService.userService, 'updatePortfolio');
    userService.userService.updatePortfolio.mockRejectedValue('Some Error');
    const { container } = render(
      <Portfolio companyExperience="experience" portfolio={[{}]} />
    );
    await act(async () => {
      await fireEvent.click(
        container.firstChild.lastChild.firstChild.firstChild
      );
    });
    expect(spy).toHaveBeenCalledWith('experience', [{}]);
    expect(container.firstChild.lastChild.lastChild).toHaveClass('col');
    expect(container.firstChild.lastChild.lastChild.children).toHaveLength(1);
    expect(container.firstChild.lastChild.lastChild.firstChild).toHaveClass(
      'fade alert alert-danger alert-dismissible show'
    );
    expect(
      container.firstChild.lastChild.lastChild.firstChild.getAttribute('role')
    ).toEqual('alert');
    expect(
      container.firstChild.lastChild.lastChild.firstChild
    ).toHaveTextContent('Some Error');
    expect(
      container.firstChild.lastChild.lastChild.firstChild.children
    ).toHaveLength(1);
    expect(
      container.firstChild.lastChild.lastChild.firstChild.firstChild.getAttribute(
        'aria-label'
      )
    ).toEqual('Close alert');
    expect(
      container.firstChild.lastChild.lastChild.firstChild.firstChild.getAttribute(
        'type'
      )
    ).toEqual('button');
    expect(
      container.firstChild.lastChild.lastChild.firstChild.firstChild
    ).toHaveClass('btn-close');
  });

  it('is able to close an alert after failure', async () => {
    userService.userService.updatePortfolio.mockRejectedValue('Some Error');
    const { container } = render(
      <Portfolio companyExperience="experience" portfolio={[{}]} />
    );
    await act(async () => {
      await fireEvent.click(
        container.firstChild.lastChild.firstChild.firstChild
      );
    });
    expect(container.firstChild.lastChild.lastChild.children).toHaveLength(1);
    await fireEvent.click(
      container.firstChild.lastChild.lastChild.firstChild.firstChild
    );
    expect(container.firstChild.lastChild.lastChild.children).toHaveLength(0);
  });

  it('has an alert on success of a submission', async () => {
    const spy = jest.spyOn(userService.userService, 'updatePortfolio');
    userService.userService.updatePortfolio.mockResolvedValue('Some Success');
    const { container } = render(
      <Portfolio companyExperience="experience" portfolio={[{}]} />
    );
    await act(async () => {
      await fireEvent.click(
        container.firstChild.lastChild.firstChild.firstChild
      );
    });
    expect(spy).toHaveBeenCalledWith('experience', [{}]);
    expect(container.firstChild.lastChild.lastChild).toHaveClass('col');
    expect(container.firstChild.lastChild.lastChild.children).toHaveLength(1);
    expect(container.firstChild.lastChild.lastChild.firstChild).toHaveClass(
      'fade alert alert-success alert-dismissible show'
    );
    expect(
      container.firstChild.lastChild.lastChild.firstChild.getAttribute('role')
    ).toEqual('alert');
    expect(
      container.firstChild.lastChild.lastChild.firstChild
    ).toHaveTextContent('Portfolio Updated');
    expect(
      container.firstChild.lastChild.lastChild.firstChild.children
    ).toHaveLength(1);
    expect(
      container.firstChild.lastChild.lastChild.firstChild.firstChild.getAttribute(
        'aria-label'
      )
    ).toEqual('Close alert');
    expect(
      container.firstChild.lastChild.lastChild.firstChild.firstChild.getAttribute(
        'type'
      )
    ).toEqual('button');
    expect(
      container.firstChild.lastChild.lastChild.firstChild.firstChild
    ).toHaveClass('btn-close');
  });

  it('is able to close an alert after success', async () => {
    userService.userService.updatePortfolio.mockResolvedValue('Some Success');
    const { container } = render(
      <Portfolio companyExperience="experience" portfolio={[{}]} />
    );
    await act(async () => {
      await fireEvent.click(
        container.firstChild.lastChild.firstChild.firstChild
      );
    });
    expect(container.firstChild.lastChild.lastChild.children).toHaveLength(1);
    await fireEvent.click(
      container.firstChild.lastChild.lastChild.firstChild.firstChild
    );
    expect(container.firstChild.lastChild.lastChild.children).toHaveLength(0);
  });

  it('removes the success alert after 5 seconds', async () => {
    userService.userService.updatePortfolio.mockResolvedValue('Some Success');
    const { container } = render(
      <Portfolio companyExperience="experience" portfolio={[{}]} />
    );
    await act(async () => {
      await fireEvent.click(
        container.firstChild.lastChild.firstChild.firstChild
      );
    });
    expect(container.firstChild.lastChild.lastChild.children).toHaveLength(1);
    await act(async () => {
      // eslint-disable-next-line no-promise-executor-return
      await new Promise((r) => setTimeout(r, 5000));
    });
    expect(container.firstChild.lastChild.lastChild.children).toHaveLength(0);
  });

  it('can handle changing of values', async () => {
    const spy = jest.spyOn(userService.userService, 'updatePortfolio');
    userService.userService.updatePortfolio.mockResolvedValue('Some Success');
    const { container } = render(
      <Portfolio companyExperience="experience" portfolio={[{}]} />
    );
    await fireEvent.change(
      container.firstChild.children[1].firstChild.firstChild.firstChild,
      { target: { value: 'new experience' } }
    );
    await fireEvent.change(
      container.firstChild.children[2].firstChild.firstChild.firstChild,
      { target: { value: 'some description' } }
    );
    await fireEvent.change(
      container.firstChild.children[2].lastChild.firstChild.firstChild,
      { target: { value: 'https://linkity.link' } }
    );
    await act(async () => {
      await fireEvent.click(
        container.firstChild.lastChild.firstChild.firstChild
      );
    });
    expect(spy).toHaveBeenCalledWith('new experience', [
      { description: 'some description', link: 'https://linkity.link' },
      {},
    ]);
  });

  it('adds a new row once description AND link have been filled out', async () => {
    const { container } = render(
      <Portfolio companyExperience="" portfolio={[{}]} />
    );
    expect(container.children).toHaveLength(1);
    expect(container.firstChild.getAttribute('noValidate')).toEqual('');
    expect(container.firstChild.children).toHaveLength(4);
    await fireEvent.change(
      container.firstChild.children[2].firstChild.firstChild.firstChild,
      { target: { value: 'some description' } }
    );
    expect(container.firstChild.children).toHaveLength(4);
    await fireEvent.change(
      container.firstChild.children[2].lastChild.firstChild.firstChild,
      { target: { value: 'https://linkity.link' } }
    );
    expect(container.firstChild.children).toHaveLength(5);
    expect(
      container.firstChild.children[3].firstChild.firstChild.firstChild.getAttribute(
        'id'
      )
    ).toEqual('1:Description');
    expect(
      container.firstChild.children[3].lastChild.firstChild.firstChild.getAttribute(
        'id'
      )
    ).toEqual('1:Link');
  });
});
