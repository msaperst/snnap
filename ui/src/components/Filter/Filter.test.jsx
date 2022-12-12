import React from 'react';
import '@testing-library/jest-dom';
import { act } from 'react-dom/test-utils';
import { render, waitFor, screen, fireEvent } from '@testing-library/react';
import WS from 'jest-websocket-mock';
import { selectFairfax } from '../CommonTestComponents';
import Filter from './Filter';

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
  let server;

  const types = [
    { id: 1, type: "B'nai Mitzvah", plural: "B'nai Mitzvahs" },
    { id: 2, type: 'Misc', plural: 'Misc' },
    { id: 3, type: 'Other', plural: 'Others' },
  ];
  const subtypes = [
    { id: 1, type: 'Assistant', plural: 'Assistants' },
    { id: 2, type: 'Second', plural: 'Seconds' },
    { id: 3, type: 'Other', plural: 'Others' },
  ];
  const jobs = [
    {
      id: 1,
      lat: '38.8462236',
      lon: '-77.3063733',
      details: 'some details',
      typeId: 1,
      subtypeId: 1,
    },
    {
      id: 2,
      lat: '38.8051095',
      lon: '-77.0470229',
      details: 'other details',
      typeId: 2,
      subtypeId: 2,
    },
    {
      id: 3,
      lat: '39.84487',
      lon: '-77.43540260778344',
      details: 'third details',
      typeId: 2,
      subtypeId: 2,
    },
    {
      id: 4,
      lat: '38.8462236',
      lon: '-77.3063733',
      details: 'fourth details',
      typeId: 2,
      subtypeId: 2,
    },
    {
      id: 5,
      lat: '24.5878990',
      lon: '-72.5467790',
      details: 'fifth',
      typeId: 2,
      subtypeId: 2,
    },
  ];

  beforeEach(async () => {
    jest.clearAllMocks();
    jest.resetAllMocks();
    jobService.jobService.getJobTypes.mockResolvedValue(types);
    jobService.jobService.getJobSubtypes.mockResolvedValue(subtypes);
    jobService.jobService.getEquipment.mockResolvedValue([]);
    jobService.jobService.getSkills.mockResolvedValue([]);
    server = new WS('wss://localhost:3001/wsapp/jobs');
  });

  afterEach(() => {
    WS.clean();
  });

  async function basicFilter() {
    await act(async () => {
      filter = render(
        <Filter
          currentUser={{ token: 1234, lat: 38.8462236, lon: -77.3063733 }}
        />
      );
      const { container } = filter;
      await waitFor(() => container.firstChild);
    });
    await server.connected;
    server.send(JSON.stringify(jobs));
  }

  async function expectOneMatch() {
    const header = screen.getByRole('heading', { level: 3 });
    expect(header.textContent).toEqual('Found 1 Job');
    const cards = screen.getAllByText('job card');
    expect(cards).toHaveLength(1);
    return true;
  }

  async function expectMatches(number) {
    const header = screen.getByRole('heading', { level: 3 });
    expect(header.textContent).toEqual(`Found ${number} Jobs`);
    if (number) {
      const cards = screen.getAllByText('job card');
      expect(cards).toHaveLength(number);
    } else {
      const cards = screen.queryByText('job card');
      expect(cards).toBeNull();
    }
    return true;
  }

  it('loads our filtering buttons', async () => {
    await basicFilter();
    const buttons = screen.getAllByRole('button');
    expect(buttons).toHaveLength(6);

    for (let i = 0; i < buttons.length; i++) {
      expect(buttons[i]).toHaveClass('btn-filter btn btn-primary');
      expect(buttons[i].getAttribute('type')).toEqual('button');
      if (i < types.length) {
        expect(buttons[i]).toHaveTextContent(types[i].plural);
      } else {
        expect(buttons[i]).toHaveTextContent(subtypes[i - types.length].plural);
      }
    }
  });

  async function renderAndGetJobsHeader(message) {
    await act(async () => {
      filter = render(
        <Filter
          currentUser={{ token: 1234, lat: 38.8462236, lon: -77.3063733 }}
        />
      );
      const { container } = filter;
      await waitFor(() => container.firstChild);
    });
    await server.connected;
    server.send(JSON.stringify(message));
    const header = screen.getByRole('heading', { level: 3 });
    return header.textContent;
  }

  it('displays no jobs when bad ws data', async () => {
    expect(await renderAndGetJobsHeader(123)).toEqual('Found 0 Jobs');
  });

  it('displays nothing when no user', async () => {
    await act(async () => {
      filter = render(
        <Filter currentUser={{ lat: 38.8462236, lon: -77.3063733 }} />
      );
      const { container } = filter;
      await waitFor(() => container.firstChild);
    });
    server.send(
      JSON.stringify([
        {
          id: 1,
          lat: '38.8462236',
          lon: '-77.3063733',
          typeId: 1,
          subtypeId: 1,
        },
      ])
    );
    expect(await expectMatches(0)).toBeTruthy();
  });

  it('displays the number of jobs when no jobs', async () => {
    expect(await renderAndGetJobsHeader([])).toEqual('Found 0 Jobs');
  });

  it('displays the number of jobs when 1 job', async () => {
    await act(async () => {
      filter = render(
        <Filter
          currentUser={{ token: 1234, lat: 38.8462236, lon: -77.3063733 }}
        />
      );
      const { container } = filter;
      await waitFor(() => container.firstChild);
    });
    await server.connected;
    server.send(
      JSON.stringify([
        {
          id: 1,
          lat: '38.8462236',
          lon: '-77.3063733',
          typeId: 1,
          subtypeId: 1,
        },
      ])
    );
    expect(await expectOneMatch()).toBeTruthy();
  });

  it('displays the number of jobs when multiple jobs', async () => {
    await basicFilter();
    expect(await expectMatches(3)).toBeTruthy();
  });

  it('displays menu with distances for filter', async () => {
    await basicFilter();
    const select = screen.getByLabelText('Within Miles');
    expect(select.children).toHaveLength(4);

    expect(select.children[0].textContent).toEqual('Within 5 miles');
    expect(select.children[0].selected).toBeFalsy();
    expect(select.children[0].value).toEqual('5');

    expect(select.children[1].textContent).toEqual('Within 25 miles');
    expect(select.children[1].selected).toBeTruthy();
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
    expect(cards).toHaveLength(3);
  });

  it('updates displayed jobs based on selected filter button', async () => {
    await basicFilter();
    const buttons = screen.getAllByRole('button');
    act(() => {
      fireEvent.click(buttons[0]);
    });
    expect(buttons[0]).toHaveClass('btn-filter btn btn-secondary');
    expect(buttons[1]).toHaveClass('btn-filter btn btn-primary');

    expect(await expectMatches(2)).toBeTruthy();
  });

  it('updates displayed jobs based on selected sub filter button', async () => {
    await basicFilter();
    const buttons = screen.getAllByRole('button');
    act(() => {
      fireEvent.click(buttons[3]);
    });
    expect(buttons[3]).toHaveClass('btn-filter btn btn-secondary');
    expect(buttons[1]).toHaveClass('btn-filter btn btn-primary');

    expect(await expectMatches(2)).toBeTruthy();
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

    expect(await expectMatches(0)).toBeTruthy();
  });

  it('updates displayed jobs based on all selected sub filter button', async () => {
    await basicFilter();
    const buttons = screen.getAllByRole('button');
    act(() => {
      fireEvent.click(buttons[4]);
    });
    act(() => {
      fireEvent.click(buttons[3]);
    });
    expect(buttons[3]).toHaveClass('btn-filter btn btn-secondary');
    expect(buttons[4]).toHaveClass('btn-filter btn btn-secondary');

    expect(await expectMatches(0)).toBeTruthy();
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

    await expectOneMatch();
  });

  it('updates displayed jobs based on unselected selected sub filter button', async () => {
    await basicFilter();
    const buttons = screen.getAllByRole('button');
    act(() => {
      fireEvent.click(buttons[3]);
    });
    act(() => {
      fireEvent.click(buttons[4]);
    });
    act(() => {
      fireEvent.click(buttons[3]);
    });
    expect(buttons[3]).toHaveClass('btn-filter btn btn-primary');
    expect(buttons[4]).toHaveClass('btn-filter btn btn-secondary');

    await expectOneMatch();
  });

  it('updates displayed jobs based on text in search box', async () => {
    await act(async () => {
      filter = render(
        <Filter
          currentUser={{ token: 1234, lat: 38.8462236, lon: -77.3063733 }}
          filter="other"
        />
      );
      const { container } = filter;
      await waitFor(() => container.firstChild);
    });
    await server.connected;
    server.send(JSON.stringify(jobs));
    expect(await expectOneMatch()).toBeTruthy();
  });

  it('updates displayed jobs based on filtered text in search box', async () => {
    await act(async () => {
      filter = render(
        <Filter
          currentUser={{ token: 1234, lat: 38.8462236, lon: -77.3063733 }}
          filter="some"
        />
      );
      const { container } = filter;
      await waitFor(() => container.firstChild);
    });
    await server.connected;
    server.send(JSON.stringify(jobs));
    expect(await expectOneMatch()).toBeTruthy();
  });

  it('updates displayed jobs based on different user home location', async () => {
    await act(async () => {
      filter = render(
        <Filter
          currentUser={{ token: 1234, lat: '39.8051095', lon: '-77.0470229' }}
        />
      );
      const { container } = filter;
      await waitFor(() => container.firstChild);
    });
    await server.connected;
    server.send(JSON.stringify(jobs));
    expect(await expectOneMatch()).toBeTruthy();
  });

  it('updates displayed jobs based on mileage dropdown', async () => {
    await basicFilter();
    const select = screen.getByLabelText('Within Miles');
    await act(async () => {
      fireEvent.change(select, { target: { value: '5' } });
    });
    expect(select.children[0].selected).toBeTruthy();
    expect(select.children[1].selected).toBeFalsy();
    expect(select.children[2].selected).toBeFalsy();
    expect(select.children[3].selected).toBeFalsy();

    expect(await expectMatches(2)).toBeTruthy();
  });

  it('updates displayed jobs based on further mileage dropdown', async () => {
    await basicFilter();
    const select = screen.getByLabelText('Within Miles');
    await act(async () => {
      fireEvent.change(select, { target: { value: '250' } });
    });
    expect(select.children[0].selected).toBeFalsy();
    expect(select.children[1].selected).toBeFalsy();
    expect(select.children[2].selected).toBeFalsy();
    expect(select.children[3].selected).toBeTruthy();

    expect(await expectMatches(4)).toBeTruthy();
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

    await expectOneMatch();
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

    expect(await expectMatches(0)).toBeTruthy();

    // select fairfax as the location
    await act(async () => {
      const selectItem = selectFairfax(screen.getByText);
      await selectItem(screen.getByRole('textbox'));
      // eslint-disable-next-line no-promise-executor-return
      await new Promise((r) => setTimeout(r, 1000));
    });

    expect(await expectMatches(3)).toBeTruthy();
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

    expect(await expectMatches(3)).toBeTruthy();
  });
});
