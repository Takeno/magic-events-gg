import React from 'react';
import {fireEvent, render, screen} from '@testing-library/react';
import Login from '../../pages/login';
import {UserContext, UserContextType} from '../../contexts/UserContext';

describe('Page /login', () => {
  it('should render correctly', () => {
    render(<Login />);

    expect(screen.getByText("Effettua l'accesso")).toBeInTheDocument();

    expect(screen.getByPlaceholderText('Email')).toBeInTheDocument();
    expect(screen.getByPlaceholderText('Password')).toBeInTheDocument();
    expect(screen.getByText('Accedi')).toBeInTheDocument();

    expect(screen.getByText('Registrati ora!').closest('a')).toHaveAttribute(
      'href',
      '/signup'
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
      signup: () => Promise.reject('Not implemented'),
      login: jest.fn(() => Promise.resolve()),
      logout: () => Promise.reject('Not implemented'),
    };

    render(
      <UserContext.Provider value={context}>
        <Login />
      </UserContext.Provider>
    );

    fireEvent.change(screen.getByPlaceholderText('Email'), {
      target: {value: 'test@test.test'},
    });

    fireEvent.change(screen.getByPlaceholderText('Password'), {
      target: {value: 'test'},
    });

    fireEvent.click(screen.getByText('Accedi'));

    expect(context.login).toBeCalledTimes(1);
    expect(context.login).toBeCalledWith('test@test.test', 'test');

    // expect(routerReplaceMock).toBeCalledTimes(1);
    // expect(routerReplaceMock).toBeCalledWith('/');

    useRouter.mockRestore();
  });
});
