import React from 'react';
import '@testing-library/jest-dom';
import { act } from 'react-dom/test-utils';
import { render, waitFor, screen, fireEvent } from '@testing-library/react';
import Filter from './Filter';
import { selectFairfax } from '../CommonTestComponents';

jest.mock('../../services/job.service');
const jobService = require('../../services/job.service');

jest.mock(
  '../Job/Job',
  () =>
    function () {
      return <div>job card</div>;
    }
);

jest.mock('../../helpers/usePosition', () => ({
  ...jest.requireActual('../../helpers/usePosition'),
  usePosition: () => ({
    latitude: '39.84487',
    longitude: '-77.43540260778344',
  }),
}));

describe('filter', () => {
  let filter;
  const types = [
    { id: 1, type: "B'nai Mitzvah", plural: "B'nai Mitzvahs" },
    { id: 2, type: 'Misc', plural: 'Misc' },
    { id: 3, type: 'Other', plural: 'Others' },
  ];

  beforeEach(async () => {
    jest.clearAllMocks();
    jest.resetAllMocks();
    jobService.jobService.getJobTypes.mockResolvedValue(types);
    jobService.jobService.getEquipment.mockResolvedValue([]);
    jobService.jobService.getSkills.mockResolvedValue([]);
    jobService.jobService.getJobs.mockResolvedValue([
      {
        id: 1,
        lat: '38.8462236',
        lon: '-77.3063733',
        details: 'some details',
        typeId: 1,
      },
      {
        id: 2,
        lat: '38.8051095',
        lon: '-77.0470229',
        details: 'other details',
        typeId: 2,
      },
      {
        id: 3,
        lat: '39.84487',
        lon: '-77.43540260778344',
        details: 'third details',
        typeId: 2,
      },
      {
        id: 4,
        lat: '38.8462236',
        lon: '-77.3063733',
        details: 'fourth details',
        typeId: 2,
      },
      {
        id: 5,
        lat: '24.5878990',
        lon: '-72.5467790',
        details: 'fifth',
        typeId: 2,
      },
    ]);
  });

  async function basicFilter() {
    await act(async () => {
      filter = render(
        <Filter currentUser={{ lat: 38.8462236, lon: -77.3063733 }} />
      );
      const { container } = filter;
      await waitFor(() => container.firstChild);
    });
  }

  async function expectOneMatch() {
    const header = screen.getByRole('heading', { level: 3 });
    expect(header.textContent).toEqual('Found 1 Job');
    const cards = screen.getAllByText('job card');
    expect(cards).toHaveLength(1);
    return true;
  }

  it('loads our filtering buttons', async () => {
    await basicFilter();
    const buttons = screen.getAllByRole('button');
    expect(buttons).toHaveLength(3);

    for (let i = 0; i < buttons.length; i++) {
      expect(buttons[i]).toHaveClass('btn-filter btn btn-primary');
      expect(buttons[i].getAttribute('type')).toEqual('button');
      expect(buttons[i]).toHaveTextContent(types[i].plural);
    }
  });

  it('displays the number of jobs when no jobs', async () => {
    jobService.jobService.getJobs.mockResolvedValue([]);
    await act(async () => {
      filter = render(
        <Filter currentUser={{ lat: 38.8462236, lon: -77.3063733 }} />
      );
      const { container } = filter;
      await waitFor(() => container.firstChild);
    });
    const header = screen.getByRole('heading', { level: 3 });
    expect(header.textContent).toEqual('Found 0 Jobs');
  });

  it('displays the number of jobs when 1 job', async () => {
    jobService.jobService.getJobs.mockResolvedValue([
      {
        id: 1,
        lat: '38.8462236',
        lon: '-77.3063733',
        typeId: 1,
      },
    ]);
    await act(async () => {
      filter = render(
        <Filter currentUser={{ lat: 38.8462236, lon: -77.3063733 }} />
      );
      const { container } = filter;
      await waitFor(() => container.firstChild);
    });

    const header = screen.getByRole('heading', { level: 3 });
    expect(header.textContent).toEqual('Found 1 Job');
  });

  it('displays the number of jobs when multiple jobs', async () => {
    await basicFilter();
    const header = screen.getByRole('heading', { level: 3 });
    expect(header.textContent).toEqual('Found 2 Jobs');
  });

  it('displays menu with distances for filter', async () => {
    await basicFilter();
    const select = screen.getByLabelText('Within Miles');
    expect(select.children).toHaveLength(4);

    expect(select.children[0].textContent).toEqual('Within 5 miles');
    expect(select.children[0].selected).toBeTruthy();
    expect(select.children[0].value).toEqual('5');

    expect(select.children[1].textContent).toEqual('Within 25 miles');
    expect(select.children[1].selected).toBeFalsy();
    expect(select.children[1].value).toEqual('25');

    expect(select.children[2].textContent).toEqual('Within 100 miles');
    expect(select.children[2].selected).toBeFalsy();
    expect(select.children[2].value).toEqual('100');

    expect(select.children[3].textContent).toEqual('Within 250 miles');
    expect(select.children[3].selected).toBeFalsy();
    expect(select.children[3].value).toEqual('250');
  });

  it('displays menu with distance options for filter', async () => {
    await basicFilter();
    const select = screen.getByLabelText('Where At');
    expect(select.children).toHaveLength(3);

    expect(select.children[0].textContent).toEqual('my home');
    expect(select.children[0].selected).toBeTruthy();
    expect(select.children[0].value).toEqual('my home');

    expect(select.children[1].textContent).toEqual('my location');
    expect(select.children[1].selected).toBeFalsy();
    expect(select.children[1].value).toEqual('my location');

    expect(select.children[2].textContent).toEqual('custom');
    expect(select.children[2].selected).toBeFalsy();
    expect(select.children[2].value).toEqual('custom');
  });

  it('shows correct jobs based on default filter', async () => {
    await basicFilter();
    const cards = screen.getAllByText('job card');
    expect(cards).toHaveLength(2);
  });

  it('updates displayed jobs based on selected filter button', async () => {
    await basicFilter();
    const buttons = screen.getAllByRole('button');
    act(() => {
      fireEvent.click(buttons[0]);
    });
    expect(buttons[0]).toHaveClass('btn-filter btn btn-secondary');
    expect(buttons[1]).toHaveClass('btn-filter btn btn-primary');

    expectOneMatch();
  });

  it('updates displayed jobs based on all selected filter button', async () => {
    await basicFilter();
    const buttons = screen.getAllByRole('button');
    act(() => {
      fireEvent.click(buttons[1]);
    });
    act(() => {
      fireEvent.click(buttons[0]);
    });
    expect(buttons[0]).toHaveClass('btn-filter btn btn-secondary');
    expect(buttons[1]).toHaveClass('btn-filter btn btn-secondary');

    const header = screen.getByRole('heading', { level: 3 });
    expect(header.textContent).toEqual('Found 0 Jobs');
    const cards = screen.queryByText('job card');
    expect(cards).toBeNull();
  });

  it('updates displayed jobs based on unselected selected filter button', async () => {
    await basicFilter();
    const buttons = screen.getAllByRole('button');
    act(() => {
      fireEvent.click(buttons[0]);
    });
    act(() => {
      fireEvent.click(buttons[1]);
    });
    act(() => {
      fireEvent.click(buttons[0]);
    });
    expect(buttons[0]).toHaveClass('btn-filter btn btn-primary');
    expect(buttons[1]).toHaveClass('btn-filter btn btn-secondary');

    expectOneMatch();
  });

  it('updates displayed jobs based on text in search box', async () => {
    await act(async () => {
      filter = render(
        <Filter
          currentUser={{ lat: 38.8462236, lon: -77.3063733 }}
          filter="details"
        />
      );
      const { container } = filter;
      await waitFor(() => container.firstChild);
    });
    const header = screen.getByRole('heading', { level: 3 });
    expect(header.textContent).toEqual('Found 2 Jobs');
    const cards = screen.getAllByText('job card');
    expect(cards).toHaveLength(2);
  });

  it('updates displayed jobs based on filtered text in search box', async () => {
    await act(async () => {
      filter = render(
        <Filter
          currentUser={{ lat: 38.8462236, lon: -77.3063733 }}
          filter="some"
        />
      );
      const { container } = filter;
      await waitFor(() => container.firstChild);
    });
    expect(expectOneMatch()).toBeTruthy();
  });

  it('updates displayed jobs based on different user home location', async () => {
    await act(async () => {
      filter = render(
        <Filter currentUser={{ lat: '38.8051095', lon: '-77.0470229' }} />
      );
      const { container } = filter;
      await waitFor(() => container.firstChild);
    });
    expect(expectOneMatch()).toBeTruthy();
  });

  it('updates displayed jobs based on mileage dropdown', async () => {
    await basicFilter();
    const select = screen.getByLabelText('Within Miles');
    act(() => {
      fireEvent.change(select, { target: { value: '25' } });
    });
    expect(select.children[0].selected).toBeFalsy();
    expect(select.children[1].selected).toBeTruthy();
    expect(select.children[2].selected).toBeFalsy();
    expect(select.children[3].selected).toBeFalsy();

    const header = screen.getByRole('heading', { level: 3 });
    expect(header.textContent).toEqual('Found 3 Jobs');
    const cards = screen.getAllByText('job card');
    expect(cards).toHaveLength(3);
  });

  it('updates displayed jobs based on further mileage dropdown', async () => {
    await basicFilter();
    const select = screen.getByLabelText('Within Miles');
    act(() => {
      fireEvent.change(select, { target: { value: '250' } });
    });
    expect(select.children[0].selected).toBeFalsy();
    expect(select.children[1].selected).toBeFalsy();
    expect(select.children[2].selected).toBeFalsy();
    expect(select.children[3].selected).toBeTruthy();

    const header = screen.getByRole('heading', { level: 3 });
    expect(header.textContent).toEqual('Found 4 Jobs');
    const cards = screen.getAllByText('job card');
    expect(cards).toHaveLength(4);
  });

  it('updates displayed jobs based on from where dropdown', async () => {
    await basicFilter();
    const select = screen.getByLabelText('Where At');
    act(() => {
      fireEvent.change(select, { target: { value: 'my location' } });
    });
    expect(select.children[0].selected).toBeFalsy();
    expect(select.children[1].selected).toBeTruthy();
    expect(select.children[2].selected).toBeFalsy();

    expectOneMatch();
  });

  it('updates displayed jobs based on custom where dropdown', async () => {
    await basicFilter();
    const select = screen.getByLabelText('Where At');
    act(() => {
      fireEvent.change(select, { target: { value: 'custom' } });
    });
    expect(select.children[0].selected).toBeFalsy();
    expect(select.children[1].selected).toBeFalsy();
    expect(select.children[2].selected).toBeTruthy();

    let header = screen.getByRole('heading', { level: 3 });
    expect(header.textContent).toEqual('Found 0 Jobs');

    // select fairfax as the location
    await act(async () => {
      const selectItem = selectFairfax(screen.getByText);
      await selectItem(screen.getByRole('textbox'));
      // eslint-disable-next-line no-promise-executor-return
      await new Promise((r) => setTimeout(r, 1000));
    });

    header = screen.getByRole('heading', { level: 3 });
    expect(header.textContent).toEqual('Found 2 Jobs');
    const cards = screen.getAllByText('job card');
    expect(cards).toHaveLength(2);
  });

  it('updates displayed jobs based on my home dropdown', async () => {
    await basicFilter();
    const select = screen.getByLabelText('Where At');
    act(() => {
      fireEvent.change(select, { target: { value: 'my location' } });
    });
    act(() => {
      fireEvent.change(select, { target: { value: 'my home' } });
    });
    expect(select.children[0].selected).toBeTruthy();
    expect(select.children[1].selected).toBeFalsy();
    expect(select.children[2].selected).toBeFalsy();

    const header = screen.getByRole('heading', { level: 3 });
    expect(header.textContent).toEqual('Found 2 Jobs');
    const cards = screen.getAllByText('job card');
    expect(cards).toHaveLength(2);
  });
});
