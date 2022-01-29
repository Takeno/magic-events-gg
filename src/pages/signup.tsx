import type {NextPage} from 'next';
import React, {useState} from 'react';
import Head from 'next/head';
import Link from 'next/link';
import {useUser} from '../contexts/UserContext';

type PageProps = {};

const Signup: NextPage<PageProps> = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  const {signup} = useUser();

  const handleSubmit = async (e: any) => {
    e.preventDefault();

    await signup(email, password);
  };

  return (
    <>
      <Head>
        <title>Tutti gli eventi di Magic vicino a te! - magic-events.gg</title>
      </Head>

      <h1>Registrazione</h1>

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

        <button>Crea</button>
      </form>
    </>
  );
};

export default Signup;
