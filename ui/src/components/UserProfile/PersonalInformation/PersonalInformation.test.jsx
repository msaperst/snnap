import React from 'react';
import { fireEvent, render, waitFor } from '@testing-library/react';
import '@testing-library/jest-dom';
import Adapter from '@wojtekmaj/enzyme-adapter-react-17';
import Enzyme from 'enzyme';
import { act } from 'react-dom/test-utils';
import PersonalInformation from './PersonalInformation';
import { selectFairfax } from '../../CommonTestComponents';
import { hasError } from '../CommonTestComponents';

jest.mock('../../../services/user.service');
const userService = require('../../../services/user.service');

Enzyme.configure({ adapter: new Adapter() });

describe('personal information', () => {
  jest.setTimeout(10000);

  beforeEach(() => {
    jest.clearAllMocks();
    jest.resetAllMocks();
  });

  it('renders nothing when no values are passed', () => {
    const { container } = render(<PersonalInformation />);
    expect(container.children).toHaveLength(0);
  });

  it('renders header properly', () => {
    const { container } = render(<PersonalInformation user={{}} />);
    expect(container.children).toHaveLength(1);
    expect(container.firstChild.getAttribute('noValidate')).toEqual('');
    expect(container.firstChild.children).toHaveLength(4);
    expect(container.firstChild.firstChild).toHaveTextContent(
      'Personal Information'
    );
  });

  it('has 2 items in the first row', () => {
    const { container } = render(<PersonalInformation user={{}} />);
    expect(container.firstChild.children[1]).toHaveClass('mb-3 row');
    expect(container.firstChild.children[1].children).toHaveLength(2);
  });

  it('has empty firstname in the first row', () => {
    const { container } = render(<PersonalInformation user={{}} />);
    expect(container.firstChild.children[1].firstChild).toHaveClass('col-md-5');
    expect(container.firstChild.children[1].firstChild.children).toHaveLength(
      1
    );
    expect(container.firstChild.children[1].firstChild.firstChild).toHaveClass(
      'form-floating'
    );
    const form =
      container.firstChild.children[1].firstChild.firstChild.firstChild;
    expect(form.getAttribute('id')).toEqual('formFirstName');
    expect(form.getAttribute('disabled')).toBeNull();
    expect(form.getAttribute('type')).toEqual('text');
    expect(form.getAttribute('value')).toEqual('');
    expect(form.getAttribute('required')).toEqual('');
    // the rest is verified in SnnapFormInput.test.jsx
  });

  it('has firstname in the first row', () => {
    const { container } = render(
      <PersonalInformation user={{ firstName: 'Max' }} />
    );
    expect(container.firstChild.children[1].firstChild).toHaveClass('col-md-5');
    expect(container.firstChild.children[1].firstChild.children).toHaveLength(
      1
    );
    expect(container.firstChild.children[1].firstChild.firstChild).toHaveClass(
      'form-floating'
    );
    const form =
      container.firstChild.children[1].firstChild.firstChild.firstChild;
    expect(form.getAttribute('id')).toEqual('formFirstName');
    expect(form.getAttribute('type')).toEqual('text');
    expect(form.getAttribute('value')).toEqual('Max');
    expect(form.getAttribute('required')).toEqual('');
    // the rest is verified in SnnapFormInput.test.jsx
  });

  it('has last name in the first row', () => {
    const { container } = render(
      <PersonalInformation user={{ lastName: 'Saperstone' }} />
    );
    expect(container.firstChild.children[1].lastChild).toHaveClass('col-md-7');
    expect(container.firstChild.children[1].lastChild.children).toHaveLength(1);
    expect(container.firstChild.children[1].lastChild.firstChild).toHaveClass(
      'form-floating'
    );
    const form =
      container.firstChild.children[1].lastChild.firstChild.firstChild;
    expect(form.getAttribute('id')).toEqual('formLastName');
    expect(form.getAttribute('type')).toEqual('text');
    expect(form.getAttribute('value')).toEqual('Saperstone');
    expect(form.getAttribute('required')).toEqual('');
    // the rest is verified in SnnapFormInput.test.jsx
  });

  it('has 1 item in the second row', () => {
    const { container } = render(<PersonalInformation user={{}} />);
    expect(container.firstChild.children[2]).toHaveClass('mb-3 row');
    expect(container.firstChild.children[2].children).toHaveLength(1);
  });

  it('has city in the second row', async () => {
    let personalInfo;
    await act(async () => {
      personalInfo = render(<PersonalInformation user={{ loc: 'Fairfax' }} />);
      const { container } = personalInfo;
      await waitFor(() => container.firstChild);
    });
    const { container } = personalInfo;
    expect(container.firstChild.children[2].firstChild).toHaveClass(
      'col-md-12'
    );
    expect(container.firstChild.children[2].firstChild.children).toHaveLength(
      1
    );
    expect(container.firstChild.children[2].firstChild.firstChild).toHaveClass(
      'form-floating'
    );
    const form =
      container.firstChild.children[2].firstChild.firstChild.children[1];
    expect(form.getAttribute('disabled')).toBeNull();
    expect(form.getAttribute('type')).toEqual('text');
    expect(form.getAttribute('required')).toEqual('true');
    // the rest is verified in SnnapFormInput.test.jsx
  });

  it('has 2 items in the last row', () => {
    const { container } = render(<PersonalInformation user={{}} />);
    expect(container.firstChild.lastChild).toHaveClass('mb-3 row');
    expect(container.firstChild.lastChild.children).toHaveLength(2);
  });

  it('has save information button in the last row', () => {
    const { container } = render(<PersonalInformation user={{}} />);
    expect(container.firstChild.lastChild.firstChild).toHaveClass('col');
    expect(container.firstChild.lastChild.firstChild.firstChild).toHaveClass(
      'btn btn-primary'
    );
    expect(
      container.firstChild.lastChild.firstChild.firstChild.getAttribute('id')
    ).toEqual('savePersonalInformationButton');
    expect(
      container.firstChild.lastChild.firstChild.firstChild.getAttribute('type')
    ).toEqual('submit');
    expect(
      container.firstChild.lastChild.firstChild.firstChild
    ).toHaveTextContent('Save Personal Information');
  });

  it('has no alert or update present in the last row', () => {
    const { container } = render(<PersonalInformation user={{}} />);
    expect(container.firstChild.lastChild.lastChild).toHaveClass('col');
    expect(container.firstChild.lastChild.lastChild.children).toHaveLength(0);
  });

  it('does not submit if values are not present/valid', async () => {
    const { container } = render(<PersonalInformation user={{}} />);
    await fireEvent.click(container.firstChild.lastChild.firstChild.firstChild);
    expect(container.firstChild.lastChild.lastChild).toHaveClass('col');
    expect(container.firstChild.lastChild.lastChild.children).toHaveLength(0);
  });

  it('has an alert when an invalid city is present', async () => {
    const spy = jest.spyOn(
      userService.userService,
      'updatePersonalInformation'
    );
    const { container } = render(
      <PersonalInformation
        user={{ firstName: 'Max', lastName: 'Saperstone', loc: 'Fairfax' }}
      />
    );
    await fireEvent.click(container.firstChild.lastChild.firstChild.firstChild);
    expect(spy).toHaveBeenCalledTimes(0);
    hasError(container, 'Please select a valid city from the drop down.');
  });

  it('has an alert when only lat is present', async () => {
    const spy = jest.spyOn(
      userService.userService,
      'updatePersonalInformation'
    );
    const { container } = render(
      <PersonalInformation
        user={{
          firstName: 'Max',
          lastName: 'Saperstone',
          loc: 'Fairfax',
          lat: 'Fairfax',
        }}
      />
    );
    await fireEvent.click(container.firstChild.lastChild.firstChild.firstChild);
    expect(spy).toHaveBeenCalledTimes(0);
    hasError(container, 'Please select a valid city from the drop down.');
  });

  it('has an alert when only lon is present', async () => {
    const spy = jest.spyOn(
      userService.userService,
      'updatePersonalInformation'
    );
    const { container } = render(
      <PersonalInformation
        user={{
          firstName: 'Max',
          lastName: 'Saperstone',
          loc: 'Fairfax',
          lon: 'Fairfax',
        }}
      />
    );
    await fireEvent.click(container.firstChild.lastChild.firstChild.firstChild);
    expect(spy).toHaveBeenCalledTimes(0);
    hasError(container, 'Please select a valid city from the drop down.');
  });

  it('has an alert on failure of a submission', async () => {
    const spy = jest.spyOn(
      userService.userService,
      'updatePersonalInformation'
    );
    userService.userService.updatePersonalInformation.mockRejectedValue(
      'Some Error'
    );
    const { container } = render(
      <PersonalInformation
        user={{
          firstName: 'Max',
          lastName: 'Saperstone',
          loc: 'Fairfax',
          lat: 7,
          lon: '22030',
        }}
      />
    );
    await act(async () => {
      await fireEvent.click(
        container.firstChild.lastChild.firstChild.firstChild
      );
    });
    expect(spy).toHaveBeenCalledWith('Max', 'Saperstone', {
      lat: 7,
      loc: 'Fairfax',
      lon: '22030',
    });
    hasError(container);
  });

  it('is able to close an alert after failure', async () => {
    userService.userService.updatePersonalInformation.mockRejectedValue(
      'Some Error'
    );
    const { container } = render(
      <PersonalInformation
        user={{
          firstName: 'Max',
          lastName: 'Saperstone',
          loc: 'Fairfax',
          lat: 7,
          lon: '22030',
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
    const spy = jest.spyOn(
      userService.userService,
      'updatePersonalInformation'
    );
    userService.userService.updatePersonalInformation.mockResolvedValue(
      'Some Success'
    );
    const { container } = render(
      <PersonalInformation
        user={{
          firstName: 'Max',
          lastName: 'Saperstone',
          loc: 'Fairfax',
          lat: 7,
          lon: '22030',
        }}
      />
    );
    await act(async () => {
      await fireEvent.click(
        container.firstChild.lastChild.firstChild.firstChild
      );
    });
    expect(spy).toHaveBeenCalledWith('Max', 'Saperstone', {
      lat: 7,
      loc: 'Fairfax',
      lon: '22030',
    });
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
    ).toHaveTextContent('Personal Information Updated');
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
    userService.userService.updatePersonalInformation.mockResolvedValue(
      'Some Success'
    );
    const { container } = render(
      <PersonalInformation
        user={{
          firstName: 'Max',
          lastName: 'Saperstone',
          loc: 'Fairfax',
          lat: 7,
          lon: '22030',
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
    userService.userService.updatePersonalInformation.mockResolvedValue(
      'Some Success'
    );
    const { container } = render(
      <PersonalInformation
        user={{
          firstName: 'Max',
          lastName: 'Saperstone',
          loc: 'Fairfax',
          lat: 7,
          lon: '22030',
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
    const spy = jest.spyOn(
      userService.userService,
      'updatePersonalInformation'
    );
    userService.userService.updatePersonalInformation.mockResolvedValue(
      'Some Success'
    );
    const { container, getByText } = render(
      <PersonalInformation
        user={{
          firstName: 'Max',
          lastName: 'Saperstone',
          loc: 'Main',
          lat: 18,
          lon: '34566',
        }}
      />
    );
    await fireEvent.change(
      container.firstChild.children[1].firstChild.firstChild.firstChild,
      { target: { value: 'George' } }
    );
    await fireEvent.change(
      container.firstChild.children[2].firstChild.firstChild.children[1],
      { target: { value: '' } }
    );
    const selectItem = selectFairfax(getByText);
    await selectItem(
      container.firstChild.children[2].firstChild.firstChild.children[1]
    );
    // eslint-disable-next-line no-promise-executor-return
    await new Promise((r) => setTimeout(r, 1000));

    await act(async () => {
      await fireEvent.click(
        container.firstChild.lastChild.firstChild.firstChild
      );
    });
    expect(spy).toHaveBeenNthCalledWith(2, 'George', 'Saperstone', {
      loc: 'Fairfax, VA, United States of America',
      lat: 38.8462236,
      lon: -77.3063733,
    });
  });
});
