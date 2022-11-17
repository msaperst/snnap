import React from 'react';
import { fireEvent, render, waitFor } from '@testing-library/react';
import '@testing-library/jest-dom';
import SnnapFormDuration from './SnnapFormDuration';

describe('snnap form input', () => {
  // basic input field data
  it('displays nothing when no name is provided', () => {
    const { container } = render(<SnnapFormDuration />);
    expect(container.firstChild).toBeNull();
  });

  it('defaults to a 12 column field with 1 child', () => {
    const { container } = render(<SnnapFormDuration name="123" />);
    expect(container.firstChild).toHaveClass('col-md-12');
    expect(container.firstChild.children).toHaveLength(1);
  });

  it('uses a digit column field when provided', () => {
    const { container } = render(<SnnapFormDuration size={5} name="123" />);
    expect(container.firstChild).toHaveClass('col-md-5');
  });

  it('uses a string column field when provided', () => {
    const { container } = render(<SnnapFormDuration size="5" name="123" />);
    expect(container.firstChild).toHaveClass('col-md-5');
  });

  it('is wrapped in a form float', () => {
    const { container } = render(<SnnapFormDuration size="5" name="123" />);
    expect(container.firstChild.firstChild).toHaveClass(
      'input-group has-validation'
    );
  });

  it('has a label and inputs', () => {
    const { container } = render(<SnnapFormDuration size="5" name="123" />);
    expect(container.firstChild.firstChild.children).toHaveLength(3);
  });

  it('uses an onchange when provided', () => {
    let x = 0;
    const updateX = (key, value) => {
      x = value;
    };
    const { container } = render(
      <SnnapFormDuration name="123" onChange={updateX} />
    );
    const event = {
      preventDefault() {},
      target: { value: '1234' },
    };
    fireEvent.change(container.firstChild.firstChild.firstChild, event);
    expect(x).toEqual('1234');
  });

  it('has an input field input', () => {
    const { container } = render(<SnnapFormDuration name="123" />);
    expect(container.firstChild.firstChild.firstChild).toHaveClass(
      'form-control'
    );
    expect(
      container.firstChild.firstChild.firstChild.getAttribute('id')
    ).toEqual('form123');
    expect(
      container.firstChild.firstChild.firstChild.getAttribute('placeholder')
    ).toEqual('123');
    expect(
      container.firstChild.firstChild.firstChild.getAttribute('type')
    ).toEqual('number');
    expect(
      container.firstChild.firstChild.firstChild.getAttribute('step')
    ).toEqual('0.25');
    expect(
      container.firstChild.firstChild.firstChild.getAttribute('min')
    ).toEqual('0');
    expect(
      container.firstChild.firstChild.firstChild.getAttribute('onChange')
    ).toBeNull();
    expect(container.firstChild.firstChild.firstChild).toBeRequired();
  });

  it('has a hour label', () => {
    const { container } = render(<SnnapFormDuration name="123" />);
    expect(container.firstChild.firstChild.children[1]).toHaveClass(
      'input-group-text'
    );
    expect(
      container.firstChild.firstChild.children[1].getAttribute('id')
    ).toEqual('inputGroupPost123');
    expect(container.firstChild.firstChild.children[1]).toHaveTextContent(
      'Hours'
    );
  });

  it('has a range button', () => {
    const { container } = render(<SnnapFormDuration name="123" />);
    expect(container.firstChild.firstChild.children[1].children[0]).toHaveClass(
      'range-switch form-switch'
    );
    expect(
      container.firstChild.firstChild.children[1].children[0].firstChild.getAttribute(
        'type'
      )
    ).toEqual('checkbox');
    expect(
      container.firstChild.firstChild.children[1].children[0].firstChild.getAttribute(
        'id'
      )
    ).toEqual('setRange123');
  });

  it('has an error field', () => {
    const { container } = render(<SnnapFormDuration name="123" />);
    expect(container.firstChild.firstChild.lastChild).toHaveClass(
      'invalid-feedback'
    );
    expect(container.firstChild.firstChild.lastChild).toHaveTextContent(
      'Please provide a valid 123.'
    );
  });

  // what happens when we click the button

  it('is wrapped in a form float when the range is added', async () => {
    const { container } = render(<SnnapFormDuration size="5" name="123" />);
    fireEvent.click(container.firstChild.firstChild.children[2]);
    await waitFor(() => container.firstChild);
    expect(container.firstChild.firstChild).toHaveClass(
      'input-group has-validation'
    );
  });

  it('has a label and inputs when the range is added', async () => {
    const { container } = render(<SnnapFormDuration size="5" name="123" />);
    fireEvent.click(
      container.firstChild.firstChild.children[1].children[0].firstChild
    );
    await waitFor(() => container.firstChild);
    expect(container.firstChild.firstChild.children).toHaveLength(5);
  });

  it('uses an onchange when provided when the range is added', () => {
    let x = 0;
    let y = 0;
    const updateX = (key, value) => {
      x = key;
      y = value;
    };
    const { getAllByRole } = render(
      <SnnapFormDuration name="123" onChange={updateX} />
    );
    fireEvent.click(getAllByRole('checkbox')[0]);
    const event = {
      preventDefault() {},
      target: { value: '1234' },
    };
    // expect(container.children).toHaveLength(109);
    fireEvent.change(getAllByRole('spinbutton')[0], event);
    expect(x).toEqual('123');
    expect(y).toEqual('1234');
    fireEvent.change(getAllByRole('spinbutton')[1], event);
    expect(x).toEqual('123Range');
    expect(y).toEqual('1234');
  });

  it('has an input field input when the range is added', async () => {
    const { container } = render(<SnnapFormDuration name="123" />);
    fireEvent.click(container.firstChild.firstChild.children[2]);
    await waitFor(() => container.firstChild);
    expect(container.firstChild.firstChild.firstChild).toHaveClass(
      'form-control'
    );
    expect(
      container.firstChild.firstChild.firstChild.getAttribute('id')
    ).toEqual('form123');
    expect(
      container.firstChild.firstChild.firstChild.getAttribute('placeholder')
    ).toEqual('123');
    expect(
      container.firstChild.firstChild.firstChild.getAttribute('type')
    ).toEqual('number');
    expect(
      container.firstChild.firstChild.firstChild.getAttribute('step')
    ).toEqual('0.25');
    expect(
      container.firstChild.firstChild.firstChild.getAttribute('min')
    ).toEqual('0');
    expect(
      container.firstChild.firstChild.firstChild.getAttribute('onChange')
    ).toBeNull();
    expect(container.firstChild.firstChild.firstChild).toBeRequired();
  });

  it('has a to label when the range is added', async () => {
    const { container } = render(<SnnapFormDuration name="123" />);
    fireEvent.click(
      container.firstChild.firstChild.children[1].children[0].firstChild
    );
    await waitFor(() => container.firstChild);
    expect(container.firstChild.firstChild.children[1]).toHaveClass(
      'input-group-text'
    );
    expect(
      container.firstChild.firstChild.children[1].getAttribute('id')
    ).toEqual('inputGroupTo123');
    expect(container.firstChild.firstChild.children[1]).toHaveTextContent('to');
  });

  it('has a second input field input when the range is added', async () => {
    const { container } = render(<SnnapFormDuration name="123" />);
    fireEvent.click(
      container.firstChild.firstChild.children[1].children[0].firstChild
    );
    await waitFor(() => container.firstChild);
    expect(container.firstChild.firstChild.children[2]).toHaveClass(
      'form-control'
    );
    expect(
      container.firstChild.firstChild.children[2].getAttribute('id')
    ).toEqual('form123');
    expect(
      container.firstChild.firstChild.children[2].getAttribute('placeholder')
    ).toEqual('123 Range');
    expect(
      container.firstChild.firstChild.children[2].getAttribute('type')
    ).toEqual('number');
    expect(
      container.firstChild.firstChild.children[2].getAttribute('step')
    ).toEqual('0.25');
    expect(
      container.firstChild.firstChild.children[2].getAttribute('min')
    ).toEqual('0');
    expect(
      container.firstChild.firstChild.children[2].getAttribute('onChange')
    ).toBeNull();
    expect(container.firstChild.firstChild.children[2]).toBeRequired();
  });

  it('has a hour label when the range is added', async () => {
    const { container } = render(<SnnapFormDuration name="123" />);
    fireEvent.click(
      container.firstChild.firstChild.children[1].children[0].firstChild
    );
    await waitFor(() => container.firstChild);
    expect(container.firstChild.firstChild.children[3]).toHaveClass(
      'input-group-text'
    );
    expect(
      container.firstChild.firstChild.children[3].getAttribute('id')
    ).toEqual('inputGroupPost123');
    expect(container.firstChild.firstChild.children[3]).toHaveTextContent(
      'Hours'
    );
  });

  it('has an error field when the range is added', async () => {
    const { container } = render(<SnnapFormDuration name="123" />);
    fireEvent.click(
      container.firstChild.firstChild.children[1].children[0].firstChild
    );
    await waitFor(() => container.firstChild);
    expect(container.firstChild.firstChild.lastChild).toHaveClass(
      'invalid-feedback'
    );
    expect(container.firstChild.firstChild.lastChild).toHaveTextContent(
      'Please provide a valid 123.'
    );
  });

  it('uses an onchange when provided when the range is removed', () => {
    let x = 0;
    let y = 0;
    const updateX = (key, value) => {
      x = key;
      y = value;
    };
    const { getByRole } = render(
      <SnnapFormDuration name="123" onChange={updateX} />
    );
    fireEvent.click(getByRole('checkbox'));
    fireEvent.click(getByRole('checkbox'));
    expect(x).toEqual('123Range');
    expect(y).toBeNull();
  });
});
