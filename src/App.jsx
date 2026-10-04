import { BrowserRouter, Route, Routes } from 'react-router-dom';
import { LanguageProvider } from './context/LanguageContext';
import { Layout } from './components/Layout';
import { HomePage } from './pages/HomePage';
import { AdvocatePage } from './pages/AdvocatePage';

export default function App() {
  return (
    <LanguageProvider>
      <BrowserRouter>
        <Layout>
          <Routes>
            <Route path="/" element={<HomePage />} />
            <Route path="/advocate" element={<AdvocatePage />} />
          </Routes>
        </Layout>
      </BrowserRouter>
    </LanguageProvider>
  );
}
