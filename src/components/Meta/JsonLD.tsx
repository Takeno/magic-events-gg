import Head from 'next/head';
import {useMemo} from 'react';

type leaf = {
  [key: string]: string | number | string[] | undefined | leaf;
};

type entry = Record<string, leaf[] | leaf | string | string[] | undefined>;

type JsonLDProps = {
  children: entry | entry[];
};

export default function JsonLD({children}: JsonLDProps) {
  const content = useMemo(() => {
    console.log('render');
    return JSON.stringify(children);
  }, [children]);

  return (
    <Head>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{__html: content}}
      />
    </Head>
  );
}
