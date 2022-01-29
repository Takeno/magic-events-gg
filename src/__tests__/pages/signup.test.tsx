import React from 'react';
import {fireEvent, render, screen} from '@testing-library/react';
import Signup from '../../pages/signup';
import {UserContext, UserContextType} from '../../contexts/UserContext';

describe('Page /signup', () => {
  it('should render correctly', () => {
    render(<Signup />);

    expect(screen.getByText('Registra un nuovo account')).toBeInTheDocument();

    expect(screen.getByPlaceholderText('Email')).toBeInTheDocument();
    expect(screen.getByPlaceholderText('Password')).toBeInTheDocument();
    expect(screen.getByText('Registrati!')).toBeInTheDocument();

    expect(screen.getByText("Effettua l'accesso").closest('a')).toHaveAttribute(
      'href',
      '/login'
    );
  });

  it('should call login method', () => {
    const routerReplaceMock = jest.fn();

    const useRouter = jest.spyOn(require('next/router'), 'useRouter');
    useRouter.mockReturnValue({
      replace: routerReplaceMock,
    });

    const context: UserContextType = {
      user: null,
      signup: jest.fn(() => Promise.resolve()),
      login: () => Promise.reject('Not implemented'),
      logout: () => Promise.reject('Not implemented'),
    };

    render(
      <UserContext.Provider value={context}>
        <Signup />
      </UserContext.Provider>
    );

    fireEvent.change(screen.getByPlaceholderText('Email'), {
      target: {value: 'test@test.test'},
    });

    fireEvent.change(screen.getByPlaceholderText('Password'), {
      target: {value: 'test'},
    });

    fireEvent.click(screen.getByText('Registrati!'));

    expect(context.signup).toBeCalledTimes(1);
    expect(context.signup).toBeCalledWith('test@test.test', 'test');

    // expect(routerReplaceMock).toBeCalledTimes(1);
    // expect(routerReplaceMock).toBeCalledWith('/');

    useRouter.mockRestore();
  });
});
