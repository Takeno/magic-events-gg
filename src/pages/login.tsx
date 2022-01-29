import {useState} from 'react';
import type {NextPage} from 'next';
import Head from 'next/head';
import {useRouter} from 'next/router';
import {useUser} from '../contexts/UserContext';

type PageProps = {};

const Login: NextPage<PageProps> = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  const {login} = useUser();
  const router = useRouter();

  const handleSubmit = async (e: any) => {
    e.preventDefault();

    await login(email, password);

    router.replace('/');
  };

  return (
    <>
      <Head>
        <title>Tutti gli eventi di Magic vicino a te! - magic-events.gg</title>
      </Head>

      <h1>Login</h1>

      <form onSubmit={handleSubmit}>
        <input
          placeholder="email"
          name="email"
          type="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
        />
        <input
          placeholder="password"
          name="password"
          type="password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
        />

        <button>Login</button>
      </form>
    </>
  );
};

export default Login;
