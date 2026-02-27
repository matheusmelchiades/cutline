import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom'

// Pages serão adicionadas na Fase 1 (UI Agent)
// Por ora, placeholder mínimo para o app compilar

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<div className="p-4 text-text-1">Cutline — setup OK ✓</div>} />
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </BrowserRouter>
  )
}

export default App
