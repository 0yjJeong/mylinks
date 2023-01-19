import { BrowserRouter, Route, Routes } from 'react-router-dom';
import List from './list';

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path='/list/:id' element={<List />} />
        <Route index element={<>Home</>} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
