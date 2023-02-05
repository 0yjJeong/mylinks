import { BrowserRouter, Route, Routes } from 'react-router-dom';
import Landing from './landing';
import List from './list';

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path='/table' element={<List />} />
        <Route path='/table/:id' element={<List />} />
        <Route index element={<Landing />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
