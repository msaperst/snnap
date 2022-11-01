import React from 'react';
import '@testing-library/jest-dom';
import { render } from '@testing-library/react';
import PortfolioLink from './PortfolioLink';

describe('portfolio link', () => {
  it('displays nothing when no portfolio', () => {
    const { container } = render(<PortfolioLink />);
    expect(container.children).toHaveLength(0);
  });

  it('displays nothing when nothing', () => {
    const { container } = render(<PortfolioLink portfolio={{}} />);
    expect(container.children).toHaveLength(0);
  });

  it('displays nothing when no link', () => {
    const { container } = render(
      <PortfolioLink portfolio={{ description: 'description' }} />
    );
    expect(container.children).toHaveLength(0);
  });

  it('displays nothing when no description', () => {
    const { container } = render(
      <PortfolioLink portfolio={{ link: 'link' }} />
    );
    expect(container.children).toHaveLength(0);
  });

  function checkLink(container, link, description) {
    expect(container.children).toHaveLength(1);
    expect(container.firstChild).toHaveClass('mb-1');
    expect(container.firstChild.children).toHaveLength(1);
    expect(container.firstChild.firstChild.children).toHaveLength(1);
    const href = container.firstChild.firstChild.firstChild;
    expect(href.getAttribute('href')).toEqual(link);
    expect(href.getAttribute('target')).toEqual('_blank');
    expect(href.getAttribute('rel')).toEqual('noreferrer');
    expect(href).toHaveTextContent(description);
    expect(href.children).toHaveLength(0);
    return true;
  }

  it('has link stuff', () => {
    const { container } = render(
      <PortfolioLink
        portfolio={{ link: 'https://link.com', description: 'description' }}
      />
    );
    expect(
      checkLink(container, 'https://link.com', 'description')
    ).toBeTruthy();
  });

  it('adds http when link without', () => {
    const { container } = render(
      <PortfolioLink
        portfolio={{ link: 'link.com', description: 'description' }}
      />
    );
    expect(checkLink(container, 'http://link.com', 'description')).toBeTruthy();
  });
});
