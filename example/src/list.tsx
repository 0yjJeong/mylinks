import Wrapper, { DataManager, Header, Navigation } from '@mylinks/dashboard';

const apiUrl = import.meta.env.VITE_API_URL || 'http://localhost:5000';

const List = () => {
  const dataManager = new DataManager(apiUrl);
  return (
    <Wrapper dataManager={dataManager}>
      <Header />
      <Navigation />
    </Wrapper>
  );
};

export default List;
