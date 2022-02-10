import React from 'react';
import {
  fireEvent,
  getByText,
  render,
  waitFor,
  screen,
} from '@testing-library/react';
import '@testing-library/jest-dom';
// import Adapter from '@wojtekmaj/enzyme-adapter-react-17';
import NewRequestToHire from './NewRequestToHire';

// Enzyme.configure({ adapter: new Adapter() });

describe('snnap form input', () => {
  it('has a button', () => {
    const { container } = render(<NewRequestToHire />);
    expect(container.children).toHaveLength(1);
    expect(container.firstChild).toHaveClass('btn btn-primary');
    expect(container.firstChild.getAttribute('type')).toEqual('button');
    expect(container.firstChild).toHaveTextContent('New Request To Hire');
  });

  it('opens a modal when button is clicked', async () => {
    const { container } = render(<NewRequestToHire />);
    await waitFor(() => container.firstChild);
    const button = getByText(container, 'New Request To Hire');
    fireEvent.click(button);
    const modal = screen.getByTestId('newRequestToHireModal');
    expect(modal).toBeVisible();
  });

  // TODO - test that state changes are made when updating values
  // TODO - test that we can submit
});
