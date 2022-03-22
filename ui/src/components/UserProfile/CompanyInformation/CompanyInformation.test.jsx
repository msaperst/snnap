import React from 'react';
import { fireEvent, render } from '@testing-library/react';
import '@testing-library/jest-dom';
import Adapter from '@wojtekmaj/enzyme-adapter-react-17';
import Enzyme from 'enzyme';
import { act } from 'react-dom/test-utils';
import CompanyInformation from './CompanyInformation';

jest.mock('../../../services/user.service');
const userService = require('../../../services/user.service');

Enzyme.configure({ adapter: new Adapter() });

describe('Company information', () => {
  jest.setTimeout(10000);

  beforeEach(() => {
    jest.clearAllMocks();
    jest.resetAllMocks();
  });

  it('renders nothing when no values are passed', () => {
    const { container } = render(<CompanyInformation />);
    expect(container.children).toHaveLength(0);
  });

  it('renders header properly', () => {
    const { container } = render(<CompanyInformation user={{}} />);
    expect(container.children).toHaveLength(1);
    expect(container.firstChild.getAttribute('noValidate')).toEqual('');
    expect(container.firstChild.children).toHaveLength(4);
    expect(container.firstChild.firstChild).toHaveTextContent(
      'Company Information'
    );
  });

  it('has 2 items in the first row', () => {
    const { container } = render(<CompanyInformation user={{}} />);
    expect(container.firstChild.children[1]).toHaveClass('mb-3 row');
    expect(container.firstChild.children[1].children).toHaveLength(2);
  });

  it('has empty firstname in the first row', () => {
    const { container } = render(<CompanyInformation user={{}} />);
    expect(container.firstChild.children[1].firstChild).toHaveClass('col-md-6');
    expect(container.firstChild.children[1].firstChild.children).toHaveLength(
      1
    );
    expect(container.firstChild.children[1].firstChild.firstChild).toHaveClass(
      'form-floating'
    );
    expect(
      container.firstChild.children[1].firstChild.firstChild.firstChild.getAttribute(
        'id'
      )
    ).toEqual('formFirstName');
    expect(
      container.firstChild.children[1].firstChild.firstChild.firstChild.getAttribute(
        'readOnly'
      )
    ).toBeNull();
    expect(
      container.firstChild.children[1].firstChild.firstChild.firstChild.getAttribute(
        'type'
      )
    ).toEqual('text');
    expect(
      container.firstChild.children[1].firstChild.firstChild.firstChild.getAttribute(
        'value'
      )
    ).toEqual('');
    // the rest is verified in SnnapFormInput.test.jsx
  });

  it('has firstname in the first row', () => {
    const { container } = render(
      <CompanyInformation user={{ firstName: 'Max' }} />
    );
    expect(container.firstChild.children[1].firstChild).toHaveClass('col-md-6');
    expect(container.firstChild.children[1].firstChild.children).toHaveLength(
      1
    );
    expect(container.firstChild.children[1].firstChild.firstChild).toHaveClass(
      'form-floating'
    );
    expect(
      container.firstChild.children[1].firstChild.firstChild.firstChild.getAttribute(
        'id'
      )
    ).toEqual('formFirstName');
    expect(
      container.firstChild.children[1].firstChild.firstChild.firstChild.getAttribute(
        'type'
      )
    ).toEqual('text');
    expect(
      container.firstChild.children[1].firstChild.firstChild.firstChild.getAttribute(
        'value'
      )
    ).toEqual('Max');
    // the rest is verified in SnnapFormInput.test.jsx
  });

  it('has last name in the first row', () => {
    const { container } = render(
      <CompanyInformation user={{ lastName: 'Saperstone' }} />
    );
    expect(container.firstChild.children[1].lastChild).toHaveClass('col-md-6');
    expect(container.firstChild.children[1].lastChild.children).toHaveLength(1);
    expect(container.firstChild.children[1].lastChild.firstChild).toHaveClass(
      'form-floating'
    );
    expect(
      container.firstChild.children[1].lastChild.firstChild.firstChild.getAttribute(
        'id'
      )
    ).toEqual('formLastName');
    expect(
      container.firstChild.children[1].lastChild.firstChild.firstChild.getAttribute(
        'type'
      )
    ).toEqual('text');
    expect(
      container.firstChild.children[1].lastChild.firstChild.firstChild.getAttribute(
        'value'
      )
    ).toEqual('Saperstone');
    // the rest is verified in SnnapFormInput.test.jsx
  });

  it('has 3 items in the second row', () => {
    const { container } = render(<CompanyInformation user={{}} />);
    expect(container.firstChild.children[2]).toHaveClass('mb-3 row');
    expect(container.firstChild.children[2].children).toHaveLength(3);
  });

  it('has city in the second row', () => {
    const { container } = render(
      <CompanyInformation user={{ city: 'Fairfax' }} />
    );
    expect(container.firstChild.children[2].firstChild).toHaveClass('col-md-5');
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
    ).toEqual('formCity');
    expect(
      container.firstChild.children[2].firstChild.firstChild.firstChild.getAttribute(
        'readOnly'
      )
    ).toBeNull();
    expect(
      container.firstChild.children[2].firstChild.firstChild.firstChild.getAttribute(
        'type'
      )
    ).toEqual('text');
    expect(
      container.firstChild.children[2].firstChild.firstChild.firstChild.getAttribute(
        'value'
      )
    ).toEqual('Fairfax');
    // the rest is verified in SnnapFormInput.test.jsx
  });

  it('has state in the second row', () => {
    const { container } = render(<CompanyInformation user={{ state: 'VA' }} />);
    expect(container.firstChild.children[2].children[1]).toHaveClass(
      'col-md-3'
    );
    expect(container.firstChild.children[2].children[1].children).toHaveLength(
      1
    );
    expect(container.firstChild.children[2].children[1].firstChild).toHaveClass(
      'form-floating'
    );
    expect(
      container.firstChild.children[2].children[1].firstChild.firstChild.getAttribute(
        'id'
      )
    ).toEqual('formState');
    expect(
      container.firstChild.children[2].children[1].firstChild.firstChild.getAttribute(
        'type'
      )
    ).toEqual('text');
    expect(
      container.firstChild.children[2].children[1].firstChild.firstChild.getAttribute(
        'value'
      )
    ).toEqual('VA');
    // the rest is verified in SnnapFormInput.test.jsx
  });

  it('has zip in the second row', () => {
    const { container } = render(
      <CompanyInformation user={{ zip: '22030' }} />
    );
    expect(container.firstChild.children[2].lastChild).toHaveClass('col-md-4');
    expect(container.firstChild.children[2].lastChild.children).toHaveLength(1);
    expect(container.firstChild.children[2].lastChild.firstChild).toHaveClass(
      'form-floating'
    );
    expect(
      container.firstChild.children[2].lastChild.firstChild.firstChild.getAttribute(
        'id'
      )
    ).toEqual('formZip');
    expect(
      container.firstChild.children[2].lastChild.firstChild.firstChild.getAttribute(
        'type'
      )
    ).toEqual('text');
    expect(
      container.firstChild.children[2].lastChild.firstChild.firstChild.getAttribute(
        'value'
      )
    ).toEqual('22030');
    // the rest is verified in SnnapFormInput.test.jsx
  });

  it('has 2 items in the last row', () => {
    const { container } = render(<CompanyInformation user={{}} />);
    expect(container.firstChild.lastChild).toHaveClass('mb-3 row');
    expect(container.firstChild.lastChild.children).toHaveLength(2);
  });

  it('has save information button in the last row', () => {
    const { container } = render(<CompanyInformation user={{}} />);
    expect(container.firstChild.lastChild.firstChild).toHaveClass('col');
    expect(container.firstChild.lastChild.firstChild.firstChild).toHaveClass(
      'btn btn-primary'
    );
    expect(
      container.firstChild.lastChild.firstChild.firstChild.getAttribute('id')
    ).toEqual('saveCompanyInformationButton');
    expect(
      container.firstChild.lastChild.firstChild.firstChild.getAttribute('type')
    ).toEqual('submit');
    expect(
      container.firstChild.lastChild.firstChild.firstChild
    ).toHaveTextContent('Save Company Information');
  });

  it('has no alert or update present in the last row', () => {
    const { container } = render(<CompanyInformation user={{}} />);
    expect(container.firstChild.lastChild.lastChild).toHaveClass('col');
    expect(container.firstChild.lastChild.lastChild.children).toHaveLength(0);
  });

  it('does not submit if values are not present/valid', async () => {
    const { container } = render(<CompanyInformation user={{}} />);
    await fireEvent.click(container.firstChild.lastChild.firstChild.firstChild);
    expect(container.firstChild.lastChild.lastChild).toHaveClass('col');
    expect(container.firstChild.lastChild.lastChild.children).toHaveLength(0);
  });

  it('has an alert on failure of a submission', async () => {
    const spy = jest.spyOn(userService.userService, 'updateCompanyInformation');
    userService.userService.updateCompanyInformation.mockRejectedValue(
      'Some Error'
    );
    const { container } = render(
      <CompanyInformation
        user={{
          firstName: 'Max',
          lastName: 'Saperstone',
          city: 'Fairfax',
          state: 'VA',
          zip: '22030',
        }}
      />
    );
    await act(async () => {
      await fireEvent.click(
        container.firstChild.lastChild.firstChild.firstChild
      );
    });
    expect(spy).toHaveBeenCalledWith(
      'Max',
      'Saperstone',
      'Fairfax',
      'VA',
      '22030'
    );
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
    userService.userService.updateCompanyInformation.mockRejectedValue(
      'Some Error'
    );
    const { container } = render(
      <CompanyInformation
        user={{
          firstName: 'Max',
          lastName: 'Saperstone',
          city: 'Fairfax',
          state: 'VA',
          zip: '22030',
        }}
      />
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
    const spy = jest.spyOn(userService.userService, 'updateCompanyInformation');
    userService.userService.updateCompanyInformation.mockResolvedValue(
      'Some Success'
    );
    const { container } = render(
      <CompanyInformation
        user={{
          firstName: 'Max',
          lastName: 'Saperstone',
          city: 'Fairfax',
          state: 'VA',
          zip: '22030',
        }}
      />
    );
    await act(async () => {
      await fireEvent.click(
        container.firstChild.lastChild.firstChild.firstChild
      );
    });
    expect(spy).toHaveBeenCalledWith(
      'Max',
      'Saperstone',
      'Fairfax',
      'VA',
      '22030'
    );
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
    ).toHaveTextContent('Company Information Updated');
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
    userService.userService.updateCompanyInformation.mockResolvedValue(
      'Some Success'
    );
    const { container } = render(
      <CompanyInformation
        user={{
          firstName: 'Max',
          lastName: 'Saperstone',
          city: 'Fairfax',
          state: 'VA',
          zip: '22030',
        }}
      />
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
    userService.userService.updateCompanyInformation.mockResolvedValue(
      'Some Success'
    );
    const { container } = render(
      <CompanyInformation
        user={{
          firstName: 'Max',
          lastName: 'Saperstone',
          city: 'Fairfax',
          state: 'VA',
          zip: '22030',
        }}
      />
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
    const spy = jest.spyOn(userService.userService, 'updateCompanyInformation');
    userService.userService.updateCompanyInformation.mockResolvedValue(
      'Some Success'
    );
    const { container } = render(
      <CompanyInformation
        user={{
          firstName: 'Max',
          lastName: 'Saperstone',
          city: 'Fairfax',
          state: 'VA',
          zip: '22030',
        }}
      />
    );
    await fireEvent.change(
      container.firstChild.children[2].firstChild.firstChild.firstChild,
      { target: { value: 'City' } }
    );
    await fireEvent.change(
      container.firstChild.children[2].lastChild.firstChild.firstChild,
      { target: { value: '12345' } }
    );
    await act(async () => {
      await fireEvent.click(
        container.firstChild.lastChild.firstChild.firstChild
      );
    });
    expect(spy).toHaveBeenCalledWith(
      'Max',
      'Saperstone',
      'City',
      'VA',
      '12345'
    );
  });
});
