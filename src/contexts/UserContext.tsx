import {
  createContext,
  type PropsWithChildren,
  useCallback,
  useContext,
  useEffect,
  useState,
} from 'react';
import {isAdmin} from '../utils/acl';
import {http, fetchCurrentUser} from '../utils/api';
import * as firebase from '../utils/firebase-client';

export type UserContextType = {
  user: User | null;
  loading: boolean;
  signup: (email: string, password: string) => Promise<void>;
  login: (email: string, password: string) => Promise<void>;
  resetPasswordRequest: (email: string) => Promise<void>;
  resetPasswordConfirm: (code: string, password: string) => Promise<void>;
  logout: () => Promise<void>;
};

export const UserContext = createContext<UserContextType>({
  user: null,
  loading: false,
  signup: () => Promise.reject('Not implemented'),
  login: () => Promise.reject('Not implemented'),
  resetPasswordRequest: () => Promise.reject('Not implemented'),
  resetPasswordConfirm: () => Promise.reject('Not implemented'),
  logout: () => Promise.reject('Not implemented'),
});

type UserProviderProps = PropsWithChildren<{}>;

export const UserProvider = ({children}: UserProviderProps) => {
  const [token, setToken] = useState<string>();
  const [loading, setLoading] = useState(true);
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

  const resetPasswordRequest = useCallback(async (email: string) => {
    await firebase.resetPasswordRequest(email);
  }, []);

  const resetPasswordConfirm = useCallback(
    async (code: string, password: string) => {
      await firebase.resetPasswordConfirm(code, password);
    },
    []
  );

  useEffect(() => {
    let timer: NodeJS.Timer | undefined = undefined;

    const unsub = firebase.addAuthStateListener(async (user) => {
      if (user === null) {
        setLoading(false);
        setToken(undefined);
        return;
      }

      const token = await user.getIdToken();

      setToken(token);

      timer = setInterval(async () => {
        const token = await user.getIdToken(true);

        setToken(token);
      }, 1000 * 60 * 30);
    });

    return () => {
      unsub();
      timer && clearInterval(timer);
    };
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

    fetchCurrentUser()
      .then((user) => setUser(user))
      .then(() => setLoading(false));

    return () => http.interceptors.request.eject(myInterceptor);
  }, [token]);

  return (
    <UserContext.Provider
      value={{
        user,
        loading,
        login,
        signup,
        logout,
        resetPasswordRequest,
        resetPasswordConfirm,
      }}
    >
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

export const useAdmin = () => {
  const {user, ...rest} = useUser();

  if (!isAdmin(user)) {
    throw new Error('Admin required!');
  }

  return {
    user,
    ...rest,
  };
};
