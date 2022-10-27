import React, { useEffect, useState } from 'react';
import GalleryItem from './GalleryItem';

function Gallery(props) {
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
      `galleryDescription-${portfolioItems.length - 1}`
    );
    const lastLink = document.getElementById(
      `galleryLink-${portfolioItems.length - 1}`
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
    const parts = key.split('-');
    const index = parseInt(parts[1], 10);
    const description = document.getElementById(
      `galleryDescription-${index}`
    ).value;
    const link = document.getElementById(`galleryLink-${index}`).value;
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
    items.forEach((item, i) => {
      if (!item.description && !item.link && i < items.length - 1) {
        isEmpty = i;
      }
    });
    if (isEmpty != null) {
      items.splice(isEmpty, 1);
      setPortfolioItems(items);
    }
    getPortfolioItems(items);
    setRequired();
  };

  return (
    <>
      {portfolioItems.map((portfolioItem, index, arr) => (
        <GalleryItem
          key={portfolioItem.id || index - 10}
          order={index}
          link={portfolioItem.link}
          description={portfolioItem.description}
          onChange={updatePortfolioItems}
          notRequired={
            arr.length - 1 === index &&
            !portfolioItem.link &&
            !portfolioItem.description
          }
        />
      ))}
    </>
  );
}

export default Gallery;
