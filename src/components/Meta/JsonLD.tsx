import Head from 'next/head';
import {useMemo} from 'react';

type leaf = {
  [key: string]: leaf | leaf[] | string | number | string[] | undefined;
};

type JsonLDProps = {
  children: leaf | leaf[];
};

export default function JsonLD({children}: JsonLDProps) {
  const content = useMemo(() => JSON.stringify(children), [children]);

  return (
    <Head>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{__html: content}}
      />
    </Head>
  );
}
