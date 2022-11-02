import React from 'react';
import { fireEvent, render } from '@testing-library/react';
import '@testing-library/jest-dom';
import Gallery from './Gallery';

describe('portfolio', () => {
  jest.setTimeout(10000);
  let x = 0;

  beforeEach(() => {
    jest.clearAllMocks();
    jest.resetAllMocks();
  });

  it('renders nothing when no values are passed', () => {
    const { container } = render(<Gallery />);
    expect(container.children).toHaveLength(0);
  });

  it('renders multiple portfolios properly with no data', () => {
    const { container } = render(<Gallery company={{}} />);
    expect(container.children).toHaveLength(0);
  });

  it('renders multiple portfolios properly', () => {
    const company = { portfolio: [{}, {}] };
    const { container } = render(<Gallery company={company} />);
    // we should have 3 portfolio items, the first two, and then an empty added one
    expect(container.children).toHaveLength(3);
  });

  it('has 2 items in the first row', () => {
    const company = { portfolio: [] };
    const { container } = render(<Gallery company={company} />);
    expect(container.firstChild).toHaveClass('mb-3 row');
    expect(container.firstChild.children).toHaveLength(2);
  });

  it('has description in the first row', () => {
    const company = {
      portfolio: [{ description: 'description1' }],
    };
    const { container } = render(<Gallery company={company} />);
    expect(container.firstChild.firstChild.children).toHaveLength(1);
    expect(container.firstChild.firstChild.firstChild).toHaveClass(
      'form-floating'
    );
    const form = container.firstChild.firstChild.firstChild.firstChild;
    expect(form.getAttribute('id')).toEqual('galleryDescription-0');
    expect(form.getAttribute('type')).toEqual('textarea');
    expect(form).toHaveTextContent('description1');
    expect(form.getAttribute('required')).toEqual('');
    // the rest is verified in SnnapFormInput.test.jsx
  });

  it('has link in the first row', () => {
    const company = { portfolio: [{ link: 'link1' }] };
    const { container } = render(<Gallery company={company} />);
    expect(container.firstChild.lastChild).toHaveClass('col-md-12');
    expect(container.firstChild.lastChild.children).toHaveLength(1);
    expect(container.firstChild.lastChild.firstChild).toHaveClass(
      'form-floating'
    );
    const form = container.firstChild.lastChild.firstChild.firstChild;
    expect(form.getAttribute('id')).toEqual('galleryLink-0');
    expect(form.getAttribute('type')).toEqual('text');
    expect(form.getAttribute('value')).toEqual('link1');
    expect(form.getAttribute('required')).toEqual('');
    // the rest is verified in SnnapFormInput.test.jsx
  });

  it('adds a new row once description AND link have been filled out', async () => {
    const company = { portfolio: [] };
    const { container } = render(
      <Gallery company={company} getPortfolioItems={updateX} />
    );

    expect(container.children).toHaveLength(1);
    fireEvent.change(container.firstChild.firstChild.firstChild.firstChild, {
      target: { value: 'some description' },
    });
    expect(container.children).toHaveLength(1);
    fireEvent.change(container.firstChild.lastChild.firstChild.firstChild, {
      target: { value: 'https://linkity.link' },
    });
    expect(container.children).toHaveLength(2);
    expect(
      container.lastChild.firstChild.firstChild.firstChild.getAttribute('id')
    ).toEqual('galleryDescription-1');
    expect(
      container.lastChild.lastChild.firstChild.firstChild.getAttribute('id')
    ).toEqual('galleryLink-1');
    expect(x).toEqual([
      { description: 'some description', link: 'https://linkity.link' },
      {},
    ]);
  });

  it('removes a row once the description AND link have been cleared out', () => {
    const company = {
      portfolio: [{ description: 'description1', link: 'link1' }],
    };
    const { container } = render(
      <Gallery company={company} getPortfolioItems={updateX} />
    );

    expect(container.children).toHaveLength(2);
    fireEvent.change(container.firstChild.firstChild.firstChild.firstChild, {
      target: { value: '' },
    });
    expect(container.children).toHaveLength(2);
    fireEvent.change(container.firstChild.lastChild.firstChild.firstChild, {
      target: { value: '' },
    });
    expect(container.children).toHaveLength(1);
    expect(x).toEqual([{}]);
  });

  it('does not have required on last portfolio items', async () => {
    const company = { portfolio: [] };
    const { container } = render(<Gallery company={company} />);
    expect(container.children).toHaveLength(1);
    // throwing in an update, as values aren't updated until secondary render
    fireEvent.change(container.firstChild.firstChild.firstChild.firstChild, {
      target: { value: '' },
    });
    expect(container.children).toHaveLength(1);
    expect(
      container.lastChild.firstChild.firstChild.firstChild.getAttribute(
        'required'
      )
    ).toBeNull();
    expect(
      container.lastChild.lastChild.firstChild.firstChild.getAttribute(
        'required'
      )
    ).toBeNull();
  });

  it('does have required on last portfolio items with only description', async () => {
    const company = { portfolio: [] };
    const { container } = render(
      <Gallery company={company} getPortfolioItems={updateX} />
    );

    expect(container.children).toHaveLength(1);
    fireEvent.change(container.firstChild.firstChild.firstChild.firstChild, {
      target: { value: 'some description' },
    });
    expect(container.children).toHaveLength(1);
    expect(x).toEqual([{ description: 'some description', link: '' }]);
    expect(
      container.lastChild.firstChild.firstChild.firstChild.getAttribute(
        'required'
      )
    ).toEqual('');
    expect(
      container.lastChild.lastChild.firstChild.firstChild.getAttribute(
        'required'
      )
    ).toEqual('');
  });

  it('does have required on last portfolio items with only link', async () => {
    const company = { portfolio: [] };
    const { container } = render(
      <Gallery company={company} getPortfolioItems={updateX} />
    );

    expect(container.children).toHaveLength(1);
    fireEvent.change(container.firstChild.lastChild.firstChild.firstChild, {
      target: { value: 'some link' },
    });
    expect(container.children).toHaveLength(1);
    expect(x).toEqual([{ description: '', link: 'some link' }]);
    expect(
      container.lastChild.firstChild.firstChild.firstChild.getAttribute(
        'required'
      )
    ).toEqual('');
    expect(
      container.lastChild.lastChild.firstChild.firstChild.getAttribute(
        'required'
      )
    ).toEqual('');
  });

  const updateX = (value) => {
    x = value;
  };
});
