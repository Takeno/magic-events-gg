import {
  createContext,
  type PropsWithChildren,
  useCallback,
  useContext,
  useEffect,
  useState,
} from 'react';
import {isAdmin} from '../utils/acl';
import supabase from '../utils/supabase';
import {fetchMe} from '../utils/db';

export type UserContextType = {
  user: User | null;
  loading: boolean;
  // signup: (email: string, password: string) => Promise<void>;
  // login: (email: string, password: string) => Promise<void>;
  // resetPasswordRequest: (email: string) => Promise<void>;
  // resetPasswordConfirm: (code: string, password: string) => Promise<void>;
  logout: () => Promise<void>;
};

export const UserContext = createContext<UserContextType>({
  user: null,
  loading: false,
  // signup: () => Promise.reject('Not implemented'),
  // login: () => Promise.reject('Not implemented'),
  // resetPasswordRequest: () => Promise.reject('Not implemented'),
  // resetPasswordConfirm: () => Promise.reject('Not implemented'),
  logout: () => Promise.reject('Not implemented'),
});

type UserProviderProps = PropsWithChildren<{}>;

export const UserProvider = ({children}: UserProviderProps) => {
  const [token, setToken] = useState<string>();
  const [loading, setLoading] = useState(true);
  const [user, setUser] = useState<User | null>(null);

  const login = useCallback(async (email: string, password: string) => {
    const {data, error} = await supabase.auth.signInWithPassword({
      email,
      password,
    });
    // Stop. addAuthStateListener will do the rest
  }, []);

  const signup = useCallback(async (email: string, password: string) => {
    const {data, error} = await supabase.auth.signUp({
      email,
      password,
    });
    // Stop. addAuthStateListener will do the rest
  }, []);

  const logout = useCallback(async () => {
    await supabase.auth.signOut();
    // setUser(null);
  }, []);

  // const resetPasswordRequest = useCallback(async (email: string) => {
  //   await firebase.resetPasswordRequest(email);
  // }, []);

  // const resetPasswordConfirm = useCallback(
  //   async (code: string, password: string) => {
  //     await firebase.resetPasswordConfirm(code, password);
  //   },
  //   []
  // );

  useEffect(() => {
    supabase.auth.getSession().then(async ({data: {session}, error}) => {
      if (error) {
        throw error;
      }

      if (session) {
        try {
          const user = await fetchMe(session.user.id);
          setUser(user);
        } catch (e) {
          console.error(e);
        }
      }
      setLoading(false);
    });

    const {
      data: {subscription},
    } = supabase.auth.onAuthStateChange(async (event, session) => {
      console.log(event, session);
      if (
        event === 'SIGNED_IN' ||
        event === 'TOKEN_REFRESHED' ||
        event === 'USER_UPDATED'
      ) {
        try {
          const user = await fetchMe(session!.user.id);
          setUser(user);
        } catch (e) {
          console.error(e);
        }
      }

      if (event === 'SIGNED_OUT' || event === 'USER_DELETED') {
        setUser(null);
      }
    });

    return () => subscription.unsubscribe();
  }, []);

  return (
    <UserContext.Provider
      value={{
        user,
        loading,
        // login,
        // signup,
        logout,
        // resetPasswordRequest,
        // resetPasswordConfirm,
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
