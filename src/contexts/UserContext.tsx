import {
  createContext,
  type PropsWithChildren,
  useCallback,
  useContext,
  useEffect,
  useState,
} from 'react';
import {http, fetchCurrentUser} from '../utils/api';
import * as firebase from '../utils/firebase-client';

export type UserContextType = {
  user: User | null;
  signup: (email: string, password: string) => Promise<void>;
  login: (email: string, password: string) => Promise<void>;
  logout: () => Promise<void>;
};

export const UserContext = createContext<UserContextType>({
  user: null,
  signup: () => Promise.reject('Not implemented'),
  login: () => Promise.reject('Not implemented'),
  logout: () => Promise.reject('Not implemented'),
});

type UserProviderProps = PropsWithChildren<{}>;

export const UserProvider = ({children}: UserProviderProps) => {
  const [token, setToken] = useState<string>();
  const [user, setUser] = useState<User | null>(null);

  const login = useCallback(async (email: string, password: string) => {
    await firebase.login(email, password);
    // Stop. addAuthStateListener will do the rest
  }, []);

  const signup = useCallback(async (email: string, password: string) => {
    await firebase.signUp(email, password);
    // Stop. addAuthStateListener will do the rest
  }, []);

  const logout = useCallback(async () => {
    await firebase.logout();
    // setUser(null);
  }, []);

  useEffect(() => {
    const unsub = firebase.addAuthStateListener(async (user) => {
      if (user === null) {
        setToken(undefined);
        return;
      }

      const token = await user.getIdToken();

      setToken(token);
    });

    return () => unsub();
  }, []);

  useEffect(() => {
    if (token === undefined) {
      setUser(null);
      return;
    }

    const myInterceptor = http.interceptors.request.use((config) => {
      config.headers = config.headers || {};
      config.headers.authorization = `Bearer ${token}`;

      return config;
    });

    fetchCurrentUser().then((user) => setUser(user));

    return () => http.interceptors.request.eject(myInterceptor);
  }, [token]);

  return (
    <UserContext.Provider value={{user, login, signup, logout}}>
      {children}
    </UserContext.Provider>
  );
};

export const useUser = () => useContext(UserContext);

export const useRequiredUser = () => {
  const {user, ...rest} = useUser();

  if (user === null) {
    throw new Error('User required');
  }

  return {
    user,
    ...rest,
  };
};
