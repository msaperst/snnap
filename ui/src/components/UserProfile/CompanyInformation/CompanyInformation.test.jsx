import React from 'react';
import { fireEvent, render } from '@testing-library/react';
import '@testing-library/jest-dom';
import Adapter from '@wojtekmaj/enzyme-adapter-react-17';
import Enzyme from 'enzyme';
import { act } from 'react-dom/test-utils';
import CompanyInformation from './CompanyInformation';

jest.mock('../../../services/company.service');
const companyService = require('../../../services/company.service');

jest.mock('../../../services/job.service');
const jobService = require('../../../services/job.service');

Enzyme.configure({ adapter: new Adapter() });

describe('Company information', () => {
  jest.setTimeout(10000);

  beforeEach(() => {
    jest.clearAllMocks();
    jest.resetAllMocks();
    jobService.jobService.getEquipment.mockResolvedValue([
      { id: 1, name: 'Camera' },
      { id: 2, name: 'Lights' },
      { id: 3, name: 'Action' },
      { id: 4, name: 'More' },
    ]);
    jobService.jobService.getSkills.mockResolvedValue([
      { id: 9, name: 'Children' },
      { id: 5, name: 'Retouch' },
    ]);
  });

  it('renders nothing when no values are passed', () => {
    const { container } = render(<CompanyInformation />);
    expect(container.children).toHaveLength(0);
  });

  it('renders header properly', () => {
    const { container } = render(<CompanyInformation company={{}} />);
    expect(container.children).toHaveLength(1);
    expect(container.firstChild.getAttribute('noValidate')).toEqual('');
    expect(container.firstChild.children).toHaveLength(8);
    expect(container.firstChild.firstChild).toHaveTextContent(
      'Company Information'
    );
  });

  it('has empty name in the first row', () => {
    const { container } = render(<CompanyInformation company={{}} />);
    expect(container.firstChild.children[1]).toHaveClass('mb-3 row');
    expect(container.firstChild.children[1].children).toHaveLength(1);
    expect(container.firstChild.children[1].firstChild).toHaveClass(
      'col-md-12'
    );
    expect(container.firstChild.children[1].firstChild.children).toHaveLength(
      1
    );
    expect(container.firstChild.children[1].firstChild.firstChild).toHaveClass(
      'form-floating'
    );
    const form =
      container.firstChild.children[1].firstChild.firstChild.firstChild;
    expect(form.getAttribute('id')).toEqual('formCompanyName');
    expect(form.getAttribute('readOnly')).toBeNull();
    expect(form.getAttribute('type')).toEqual('text');
    expect(form.getAttribute('value')).toEqual('');
    expect(form.getAttribute('required')).toBeNull();
    // the rest is verified in SnnapFormInput.test.jsx
  });

  it('has name in the first row', () => {
    const { container } = render(
      <CompanyInformation company={{ name: 'Max' }} />
    );
    expect(container.firstChild.children[1]).toHaveClass('mb-3 row');
    expect(container.firstChild.children[1].children).toHaveLength(1);
    expect(container.firstChild.children[1].firstChild).toHaveClass(
      'col-md-12'
    );
    expect(container.firstChild.children[1].firstChild.children).toHaveLength(
      1
    );
    expect(container.firstChild.children[1].firstChild.firstChild).toHaveClass(
      'form-floating'
    );
    const form =
      container.firstChild.children[1].firstChild.firstChild.firstChild;
    expect(form.getAttribute('id')).toEqual('formCompanyName');
    expect(form.getAttribute('type')).toEqual('text');
    expect(form.getAttribute('value')).toEqual('Max');
    expect(form.getAttribute('required')).toBeNull();
    // the rest is verified in SnnapFormInput.test.jsx
  });

  it('has website in the second row', () => {
    const { container } = render(
      <CompanyInformation company={{ website: 'Saperstone' }} />
    );
    expect(container.firstChild.children[2]).toHaveClass('mb-3 row');
    expect(container.firstChild.children[2].children).toHaveLength(1);
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
      container.firstChild.children[2].firstChild.firstChild.firstChild;
    expect(form.getAttribute('id')).toEqual('formWebsite');
    expect(form.getAttribute('type')).toEqual('text');
    expect(form.getAttribute('value')).toEqual('Saperstone');
    expect(form.getAttribute('required')).toBeNull();
    // the rest is verified in SnnapFormInput.test.jsx
  });

  it('has instagram in the third row', () => {
    const { container } = render(
      <CompanyInformation company={{ insta: 'Fairfax' }} />
    );
    expect(container.firstChild.children[3]).toHaveClass('mb-3 row');
    expect(container.firstChild.children[3].children).toHaveLength(2);
    expect(container.firstChild.children[3].firstChild).toHaveClass('col-md-2');
    expect(container.firstChild.children[3].firstChild.children).toHaveLength(
      1
    );
    expect(container.firstChild.children[3].lastChild).toHaveClass('col-md-10');
    expect(container.firstChild.children[3].lastChild.children).toHaveLength(1);
    expect(container.firstChild.children[3].lastChild.firstChild).toHaveClass(
      'form-floating'
    );
    const form =
      container.firstChild.children[3].lastChild.firstChild.firstChild;
    expect(form.getAttribute('id')).toEqual('formInstagramLink');
    expect(form.getAttribute('readOnly')).toBeNull();
    expect(form.getAttribute('type')).toEqual('text');
    expect(form.getAttribute('value')).toEqual('Fairfax');
    expect(form.getAttribute('required')).toBeNull();
    // the rest is verified in SnnapFormInput.test.jsx
  });

  it('has facebook in the fourth row', () => {
    const { container } = render(
      <CompanyInformation company={{ fb: 'Fairfax' }} />
    );
    expect(container.firstChild.children[4]).toHaveClass('mb-3 row');
    expect(container.firstChild.children[4].children).toHaveLength(2);
    expect(container.firstChild.children[4].firstChild).toHaveClass('col-md-2');
    expect(container.firstChild.children[4].firstChild.children).toHaveLength(
      1
    );
    expect(container.firstChild.children[4].lastChild).toHaveClass('col-md-10');
    expect(container.firstChild.children[4].lastChild.children).toHaveLength(1);
    expect(container.firstChild.children[4].lastChild.firstChild).toHaveClass(
      'form-floating'
    );
    const form =
      container.firstChild.children[4].lastChild.firstChild.firstChild;
    expect(form.getAttribute('id')).toEqual('formFacebookLink');
    expect(form.getAttribute('readOnly')).toBeNull();
    expect(form.getAttribute('type')).toEqual('text');
    expect(form.getAttribute('value')).toEqual('Fairfax');
    expect(form.getAttribute('required')).toBeNull();
    // the rest is verified in SnnapFormInput.test.jsx
  });

  // TODO - multiselects

  it('has 2 items in the last row', () => {
    const { container } = render(<CompanyInformation company={{}} />);
    expect(container.firstChild.lastChild).toHaveClass('mb-3 row');
    expect(container.firstChild.lastChild.children).toHaveLength(2);
  });

  it('has save information button in the last row', () => {
    const { container } = render(<CompanyInformation company={{}} />);
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
    const { container } = render(<CompanyInformation company={{}} />);
    expect(container.firstChild.lastChild.lastChild).toHaveClass('col');
    expect(container.firstChild.lastChild.lastChild.children).toHaveLength(0);
  });

  it('has an alert on failure of a submission', async () => {
    const spy = jest.spyOn(
      companyService.companyService,
      'updateCompanyInformation'
    );
    companyService.companyService.updateCompanyInformation.mockRejectedValue(
      'Some Error'
    );
    const { container } = render(
      <CompanyInformation
        company={{
          name: 'Max',
          website: 'Saperstone',
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
      undefined,
      undefined,
      [],
      []
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
    companyService.companyService.updateCompanyInformation.mockRejectedValue(
      'Some Error'
    );
    const { container } = render(
      <CompanyInformation
        company={{
          name: 'Max',
          website: 'Saperstone',
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
      companyService.companyService,
      'updateCompanyInformation'
    );
    companyService.companyService.updateCompanyInformation.mockResolvedValue(
      'Some Success'
    );
    const { container } = render(
      <CompanyInformation
        company={{
          insta: 'Max',
          fb: 'Saperstone',
        }}
      />
    );
    await act(async () => {
      await fireEvent.click(
        container.firstChild.lastChild.firstChild.firstChild
      );
    });
    expect(spy).toHaveBeenCalledWith(
      undefined,
      undefined,
      'Max',
      'Saperstone',
      [],
      []
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
    jest.spyOn(companyService.companyService, 'updateCompanyInformation');
    companyService.companyService.updateCompanyInformation.mockResolvedValue(
      'Some Success'
    );
    const { container } = render(
      <CompanyInformation
        company={{
          name: 'Max',
          website: 'Saperstone',
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
    jest.spyOn(companyService.companyService, 'updateCompanyInformation');
    companyService.companyService.updateCompanyInformation.mockResolvedValue(
      'Some Success'
    );
    const { container } = render(
      <CompanyInformation
        company={{
          name: 'Max',
          website: 'Saperstone',
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
      companyService.companyService,
      'updateCompanyInformation'
    );
    companyService.companyService.updateCompanyInformation.mockResolvedValue(
      'Some Success'
    );
    const { container } = render(
      <CompanyInformation
        company={{
          name: 'Max',
          website: 'Saperstone',
        }}
      />
    );
    await fireEvent.change(
      container.firstChild.children[2].firstChild.firstChild.firstChild,
      { target: { value: 'City' } }
    );
    await fireEvent.change(
      container.firstChild.children[3].lastChild.firstChild.firstChild,
      { target: { value: '12345' } }
    );
    await act(async () => {
      await fireEvent.click(
        container.firstChild.lastChild.firstChild.firstChild
      );
    });
    expect(spy).toHaveBeenCalledWith('Max', 'City', '12345', undefined, [], []);
  });
});
