import React from 'react';
import { render } from '@testing-library/react';
import '@testing-library/jest-dom';
import GalleryItem from './GalleryItem';

describe('portfolio item', () => {
  it('displays the basic portfolio inputs', () => {
    const { container } = render(<GalleryItem notRequired />);
    expect(container.children).toHaveLength(1);
    expect(container.firstChild).toHaveClass('row mb-3');

    expect(container.firstChild.children).toHaveLength(2);
    expect(container.firstChild.firstChild).toHaveClass('col-md-12');
    expect(container.firstChild.firstChild.firstChild).toHaveClass(
      'form-floating'
    );
    expect(
      container.firstChild.firstChild.firstChild.firstChild.getAttribute('id')
    ).toEqual('galleryDescription-undefined');
    expect(
      container.firstChild.firstChild.firstChild.firstChild.getAttribute(
        'required'
      )
    ).toBeNull();
    expect(
      container.firstChild.firstChild.firstChild.firstChild
    ).toHaveTextContent('');
    // the rest is verified in SnnapFormInput.test.jsx

    expect(container.firstChild.children).toHaveLength(2);
    expect(container.firstChild.lastChild).toHaveClass('col-md-12');
    expect(container.firstChild.lastChild.firstChild).toHaveClass(
      'form-floating'
    );
    expect(
      container.firstChild.lastChild.firstChild.firstChild.getAttribute('id')
    ).toEqual('galleryLink-undefined');
    expect(
      container.firstChild.lastChild.firstChild.firstChild.getAttribute(
        'required'
      )
    ).toBeNull();
    expect(
      container.firstChild.lastChild.firstChild.firstChild.getAttribute('value')
    ).toEqual('');
    // the rest is verified in SnnapFormInput.test.jsx
  });

  it('displays the portfolio data', () => {
    const { container } = render(
      <GalleryItem order={2} link="123" description={5} />
    );
    expect(container.children).toHaveLength(1);
    expect(container.firstChild).toHaveClass('row mb-3');

    expect(container.firstChild.children).toHaveLength(2);
    expect(container.firstChild.firstChild).toHaveClass('col-md-12');
    expect(container.firstChild.firstChild.firstChild).toHaveClass(
      'form-floating'
    );
    expect(
      container.firstChild.firstChild.firstChild.firstChild.getAttribute('id')
    ).toEqual('galleryDescription-2');
    expect(
      container.firstChild.firstChild.firstChild.firstChild.getAttribute(
        'required'
      )
    ).toEqual('');
    expect(
      container.firstChild.firstChild.firstChild.firstChild
    ).toHaveTextContent('5');
    // the rest is verified in SnnapFormInput.test.jsx

    expect(container.firstChild.children).toHaveLength(2);
    expect(container.firstChild.lastChild).toHaveClass('col-md-12');
    expect(container.firstChild.lastChild.firstChild).toHaveClass(
      'form-floating'
    );
    expect(
      container.firstChild.lastChild.firstChild.firstChild.getAttribute('id')
    ).toEqual('galleryLink-2');
    expect(
      container.firstChild.lastChild.firstChild.firstChild.getAttribute(
        'required'
      )
    ).toEqual('');
    expect(
      container.firstChild.lastChild.firstChild.firstChild.getAttribute('value')
    ).toEqual('123');
    // the rest is verified in SnnapFormInput.test.jsx
  });
});
