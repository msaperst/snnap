import React from 'react';
import '@testing-library/jest-dom';
import { fireEvent, render } from '@testing-library/react';
import { act } from 'react-dom/test-utils';
import Submit from './Submit';

let x = 'five';
const updateX = (value) => {
  x = value;
};

describe('submit', () => {
  it('shows the submit button properly', () => {
    const { container } = render(<Submit buttonText="my button info" />);

    expect(container.firstChild).toHaveClass('mb-3 row');
    expect(container.firstChild.children).toHaveLength(2);
    expect(container.firstChild.firstChild).toHaveClass('col');
    expect(container.firstChild.firstChild.firstChild).toHaveClass(
      'btn btn-primary'
    );
    expect(
      container.firstChild.firstChild.firstChild.getAttribute('id')
    ).toEqual('myButtonInfoButton');
    expect(
      container.firstChild.firstChild.firstChild.getAttribute('type')
    ).toEqual('submit');
    expect(container.firstChild.firstChild.firstChild).toHaveTextContent(
      'my button info'
    );
  });

  it('has no alert or update present by default', async () => {
    const { container } = render(<Submit buttonText="my button info" />);

    expect(container.firstChild.lastChild).toHaveClass('col');
    expect(container.firstChild.lastChild.children).toHaveLength(0);
  });

  it('an alert is present when specified', async () => {
    const { container } = render(
      <Submit
        buttonText="my button info"
        error="some error"
        updateError={updateX}
      />
    );

    expect(container.firstChild.lastChild.children).toHaveLength(1);
    expect(container.firstChild.lastChild).toHaveClass('col');
    expect(container.firstChild.lastChild.children).toHaveLength(1);
    expect(container.firstChild.lastChild.firstChild).toHaveClass(
      'fade alert alert-danger alert-dismissible show'
    );
    expect(
      container.firstChild.lastChild.firstChild.getAttribute('role')
    ).toEqual('alert');
    expect(container.firstChild.lastChild.firstChild).toHaveTextContent(
      'some error'
    );
    expect(container.firstChild.lastChild.firstChild.children).toHaveLength(1);
    expect(
      container.firstChild.lastChild.firstChild.firstChild.getAttribute(
        'aria-label'
      )
    ).toEqual('Close alert');
    expect(
      container.firstChild.lastChild.firstChild.firstChild.getAttribute('type')
    ).toEqual('button');
    expect(container.firstChild.lastChild.firstChild.firstChild).toHaveClass(
      'btn-close'
    );

    await act(async () => {
      fireEvent.click(container.firstChild.lastChild.firstChild.firstChild);
    });
    expect(x).toBeNull();
  });

  it('a success is present when specified', async () => {
    const { container } = render(
      <Submit
        buttonText="my button info"
        success="some success"
        updateSuccess={updateX}
      />
    );

    expect(container.firstChild.lastChild.children).toHaveLength(1);
    expect(container.firstChild.lastChild).toHaveClass('col');
    expect(container.firstChild.lastChild.children).toHaveLength(1);
    expect(container.firstChild.lastChild.firstChild).toHaveClass(
      'fade alert alert-success alert-dismissible show'
    );
    expect(
      container.firstChild.lastChild.firstChild.getAttribute('role')
    ).toEqual('alert');
    expect(container.firstChild.lastChild.firstChild).toHaveTextContent(
      'some success'
    );
    expect(container.firstChild.lastChild.firstChild.children).toHaveLength(1);
    expect(
      container.firstChild.lastChild.firstChild.firstChild.getAttribute(
        'aria-label'
      )
    ).toEqual('Close alert');
    expect(
      container.firstChild.lastChild.firstChild.firstChild.getAttribute('type')
    ).toEqual('button');
    expect(container.firstChild.lastChild.firstChild.firstChild).toHaveClass(
      'btn-close'
    );

    await act(async () => {
      fireEvent.click(container.firstChild.lastChild.firstChild.firstChild);
    });
    expect(x).toBeNull();
  });
});
