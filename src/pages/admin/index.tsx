import type {NextPage} from 'next';
import {useRequiredUser} from '../../contexts/UserContext';

type PageProps = {};

const AdminIndex: NextPage<PageProps> = () => {
  const {user} = useRequiredUser();

  return (
    <>
      <h1>Area Admin di {user.email}</h1>
    </>
  );
};

export default AdminIndex;
