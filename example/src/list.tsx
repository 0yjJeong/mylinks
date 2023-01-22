import Wrapper, {
  DataManager,
  Header,
  Navigation,
  Table,
  Head,
} from '@mylinks/dashboard';

const apiUrl = import.meta.env.VITE_API_URL || 'http://localhost:5000';

const List = () => {
  const dataManager = new DataManager(apiUrl);
  return (
    <Wrapper dataManager={dataManager}>
      <Header />
      <Navigation />
      <Table>
        <Head name='id'>ID</Head>
        <Head name='title'>제목</Head>
        <Head name='url'>URL</Head>
        <Head name='created_at'>추가한 날짜</Head>
        <Head name='list_id'>소속</Head>
        <Head name='description'>설명</Head>
      </Table>
    </Wrapper>
  );
};

export default List;
