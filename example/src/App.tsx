import { BrowserRouter, Route, Routes } from 'react-router-dom';
import Wrapper, { DataManager } from '@mylinks/dashboard';
import Landing from './components/landing';
import List from './list';

const apiUrl = import.meta.env.VITE_API_URL ?? '';

function App() {
  const dataManager = new DataManager(apiUrl);
  return (
    <Wrapper dataManager={dataManager}>
      <BrowserRouter>
        <Routes>
          <Route path='/table' element={<List />} />
          <Route path='/table/:id' element={<List />} />
          <Route index element={<Landing />} />
        </Routes>
      </BrowserRouter>
    </Wrapper>
  );
}

export default App;
