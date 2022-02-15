import React from 'react';
import {
  fireEvent,
  getByText,
  render,
  screen,
  waitFor,
} from '@testing-library/react';
import '@testing-library/jest-dom';
// import Adapter from '@wojtekmaj/enzyme-adapter-react-17';
import NewRequestToHire from './NewRequestToHire';

// Enzyme.configure({ adapter: new Adapter() });

describe('snnap form input', () => {
  it('has a button', () => {
    const { container } = render(<NewRequestToHire />);
    expect(container.children).toHaveLength(2); // button and div to hold modal
    expect(container.firstChild).toHaveClass('btn btn-primary');
    expect(container.firstChild.getAttribute('type')).toEqual('button');
    expect(container.firstChild).toHaveTextContent('New Request To Hire');
  });

  it('opens a modal when button is clicked', async () => {
    const { container } = render(<NewRequestToHire />);
    await waitFor(() => container.firstChild);
    const button = getByText(container, 'New Request To Hire');
    fireEvent.click(button);

    const modal = await waitFor(() =>
      screen.getByTestId('newRequestToHireModal')
    );
    expect(modal).toBeVisible();
  });

  it('updates values when data is selected', async () => {
    const { container } = render(<NewRequestToHire />);
    await waitFor(() => container.firstChild);
    const button = getByText(container, 'New Request To Hire');
    fireEvent.click(button);

    // const modal = await waitFor(() =>
    //   screen.getByTestId('newRequestToHireModal')
    // );
    // const select = getByLabelText(modal, 'Job Type');
    // fireEvent.
  });

  // it('updates values when data is entered', async () => {
  //   const { container } = render(<NewRequestToHire />);
  //   await waitFor(() => container.firstChild);
  //   const button = getByText(container, 'New Request To Hire');
  //   fireEvent.click(button);
  //
  //   const modal = await waitFor(() =>
  //     screen.getByTestId('newRequestToHireModal')
  //   );
  //   const pay = getByPlaceholderText(modal, 'Pay');
  //   fireEvent.keyDown(pay, { keycode: 49 });
  //   // const event = new KeyboardEvent('keydown', { key: '1' });
  //   // pay.dispatchEvent(event);
  //   // textarea.simulate('keydown', { which: 'a' });
  //   // expect(pay.value).toEqual('a');
  // });

  // TODO - test that state changes are made when updating values
  // TODO - test that we can submit
});
