import React, { useEffect, useState } from 'react';
import PortfolioItem from './PortfolioItem';

function PortfolioItems(props) {
  const { company, getPortfolioItems } = props;
  const [portfolioItems, setPortfolioItems] = useState([]);

  useEffect(() => {
    if (company) {
      // adding a blank portfolio instance to allow for editing ability
      let { portfolio } = company;
      if (portfolio) {
        portfolio.push({});
      } else {
        portfolio = [];
      }
      setPortfolioItems(portfolio);
    }
  }, [company]);

  if (company === undefined) {
    return null;
  }

  const setRequired = () => {
    const lastDescription = document.getElementById(
      `${portfolioItems.length - 1}:Description`
    );
    const lastLink = document.getElementById(
      `${portfolioItems.length - 1}:Link`
    );
    if (lastDescription.value === '' && lastLink.value === '') {
      lastDescription.removeAttribute('required');
      lastLink.removeAttribute('required');
    } else {
      lastDescription.setAttribute('required', '');
      lastLink.setAttribute('required', '');
    }
  };

  const updatePortfolioItems = (key) => {
    // pull the data that we need/want
    const parts = key.split(':');
    const index = parseInt(parts[0], 10);
    const description = document.getElementById(
      `${parts[0]}:Description`
    ).value;
    const link = document.getElementById(`${parts[0]}:Link`).value;
    const items = [...portfolioItems];
    items[index] = { description, link };
    setPortfolioItems(items);

    // if each row has some data, we should add another row
    let anyEmpty = true;
    items.forEach((item) => {
      if (!item.description || !item.link) {
        anyEmpty = false;
      }
    });
    if (anyEmpty) {
      items.push({});
      setPortfolioItems(items);
    }

    // if we just emptied a row, and it's not the last one, we should remove it
    let isEmpty = null;
    items.forEach((item, index) => {
      if (!item.description && !item.link && index < items.length - 1) {
        isEmpty = index;
      }
    });
    if (isEmpty != null) {
      items.splice(isEmpty, 1);
      setPortfolioItems(items);
    }
    getPortfolioItems(portfolioItems);
    setRequired();
  };

  return (
    <>
      {portfolioItems.map((portfolioItem, index) => (
        <PortfolioItem
          key={portfolioItem.id || index - 10}
          order={index}
          link={portfolioItem.link}
          description={portfolioItem.description}
          onChange={updatePortfolioItems}
        />
      ))}
    </>
  );
}

export default PortfolioItems;
