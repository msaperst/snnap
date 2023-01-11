import React from 'react';
import '@testing-library/jest-dom';
import { fireEvent, render, waitFor } from '@testing-library/react';
import { act } from 'react-dom/test-utils';
import UserVisual from './UserVisual';

jest.mock('../../services/authentication.service');
const authenticationService = require('../../services/authentication.service');

const mockedNavigate = jest.fn();
jest.mock('react-router-dom', () => ({
  ...jest.requireActual('react-router-dom'),
  useNavigate: () => mockedNavigate,
  // eslint-disable-next-line jsx-a11y/anchor-has-content,react/destructuring-assignment
  Link: (props) => <a {...props} href={props.to} />,
}));

describe('user visual', () => {
  let userVisual;

  beforeEach(async () => {
    jest.clearAllMocks();
    jest.resetAllMocks();

    authenticationService.authenticationService.currentUserValue = {
      username: 'user',
    };
  });

  async function renderUserVisual(user, avatarNav) {
    await act(async () => {
      userVisual = render(<UserVisual user={user} avatarNav={avatarNav} />);
      const { container } = userVisual;
      await waitFor(() => container.firstChild);
    });
  }

  it('navigates us to the user profile when clicked', async () => {
    await renderUserVisual({ username: 'user' }, () =>
      mockedNavigate(`/profile/user`)
    );
    const { getByLabelText } = userVisual;
    const avatar = getByLabelText('');
    await act(async () => {
      fireEvent.click(avatar);
    });
    expect(mockedNavigate).toHaveBeenCalledWith('/profile/user');
  });

  it('has no rating when none is supplied', async () => {
    await renderUserVisual({ username: 'user' }, null);
    const { container } = userVisual;
    expect(container.children[0].children[1].children).toHaveLength(0);
  });

  it('has plus rating when true is supplied', async () => {
    await renderUserVisual(
      {
        firstName: 'Max',
        lastName: 'Saperstone',
        username: 'user',
        rating: true,
      },
      null
    );
    const { container } = userVisual;
    expect(container.children[0].children[1].children).toHaveLength(1);
    expect(container.children[0].children[1].firstChild.children).toHaveLength(
      2
    );
    expect(
      container.children[0].children[1].firstChild.firstChild
    ).toHaveTextContent('Thumbs Up');
  });

  it('has minus rating when false is supplied', async () => {
    await renderUserVisual(
      {
        firstName: 'Max',
        lastName: 'Saperstone',
        username: 'user',
        rating: false,
      },
      null
    );
    const { container } = userVisual;
    expect(container.children[0].children[1].children).toHaveLength(1);
    expect(container.children[0].children[1].firstChild.children).toHaveLength(
      2
    );
    expect(
      container.children[0].children[1].firstChild.firstChild
    ).toHaveTextContent('Thumbs Down');
  });

  it('has no message icon when user is same', async () => {
    await renderUserVisual({ username: 'user' }, null);
    const { container } = userVisual;
    expect(container.children[0].lastChild.children).toHaveLength(0);
  });

  it('has chat bubble when not user', async () => {
    authenticationService.authenticationService.currentUserValue = {
      username: 'msaperst',
    };
    await renderUserVisual({ username: 'user' }, null);
    const { container } = userVisual;
    expect(container.children[0].lastChild.children).toHaveLength(1);
    expect(
      container.children[0].lastChild.firstChild.getAttribute('href')
    ).toEqual('/chat');
    expect(
      container.children[0].lastChild.firstChild.getAttribute('to')
    ).toEqual('/chat');
    expect(container.children[0].lastChild.firstChild.children).toHaveLength(1);
    expect(
      container.children[0].lastChild.firstChild.firstChild.children
    ).toHaveLength(2);
    expect(
      container.children[0].lastChild.firstChild.firstChild.firstChild
    ).toHaveTextContent('Chat');
  });
});
