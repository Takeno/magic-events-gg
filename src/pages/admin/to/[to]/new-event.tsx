import type {NextPage} from 'next';
import {useRouter} from 'next/router';
import {Field, Form} from 'react-final-form';
import Breadcrumb from '../../../../components/Breadcrumb';
import {saveEvent} from '../../../../utils/api';

type PageProps = {};

type FormType = {
  format: Format;
  timestamp: string;
  title: string;
  text: string;
};

const AdminTournamentCreate: NextPage<PageProps> = () => {
  const router = useRouter();

  const handleSubmit = async (data: FormType) => {
    if (typeof router.query.to !== 'string') {
      throw new Error('Invalid organizer');
    }

    const created = await saveEvent(router.query.to, {
      format: data.format,
      timestamp: new Date(data.timestamp).getTime(),
      title: data.title,
      text: data.text,
    });

    router.push(`/admin/to/${router.query.to}`);
  };

  return (
    <>
      <Breadcrumb
        items={[
          {
            href: '/admin',
            text: 'I miei negozi',
          },
          {
            text: 'Nuovo evento',
          },
        ]}
      />

      <div className="container mx-auto pt-4">
        <Form<FormType>
          onSubmit={handleSubmit}
          render={({handleSubmit, submitting}) => (
            <form onSubmit={handleSubmit} className="space-y-2">
              <h1 className="text-xl font-bold my-4">Aggiungi nuovo evento</h1>
              <label htmlFor="format" className="sr-only">
                Formato
              </label>
              <Field
                component="select"
                name="format"
                id="format"
                required
                className="appearance-none rounded relative block w-full px-3 py-2 border border-gray-300 placeholder-gray-500 text-gray-900"
                placeholder="Formato"
              >
                <option value="modern">modern</option>
                <option value="legacy">legacy</option>
                <option value="standard">standard</option>
                <option value="pioneer">pioneer</option>
                <option value="vintage">vintage</option>
                <option value="commander">commander</option>
                <option value="pauper">pauper</option>
              </Field>
              <label htmlFor="timestamp" className="sr-only">
                Quando
              </label>
              <Field
                component="input"
                name="timestamp"
                id="timestamp"
                type="datetime-local"
                required
                className="appearance-none rounded relative block w-full px-3 py-2 border border-gray-300 placeholder-gray-500 text-gray-900"
                placeholder="Quando"
              />

              <label htmlFor="title" className="sr-only">
                Titolo
              </label>
              <Field
                component="input"
                name="title"
                id="title"
                required
                className="appearance-none rounded relative block w-full px-3 py-2 border border-gray-300 placeholder-gray-500 text-gray-900"
                placeholder="Titolo"
              />

              <label htmlFor="text" className="sr-only">
                Descrizione
              </label>
              <Field
                component="textarea"
                name="text"
                id="text"
                required
                className="appearance-none rounded relative block w-full px-3 py-2 border border-gray-300 placeholder-gray-500 text-gray-900"
                placeholder="Descrizione"
              />

              <button
                className={`group relative w-full flex justify-center py-2 px-4 border border-transparent text-sm font-medium rounded-md text-white ${
                  submitting ? 'bg-gray-600' : 'bg-primary'
                }`}
              >
                Salva
              </button>
            </form>
          )}
        />
      </div>
    </>
  );
};

export default AdminTournamentCreate;
