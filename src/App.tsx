import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom'
import { Header } from '@/components/layout/Header'
import { BottomNav } from '@/components/layout/BottomNav'
import { RankingsPage } from '@/pages/RankingsPage'
import { SimulatorPage } from '@/pages/SimulatorPage'
import { CalendarPage } from '@/pages/CalendarPage'
import { useAdSense } from '@/hooks/useAdSense'

function App() {
  useAdSense()

  return (
    <BrowserRouter>
      <div className="min-h-screen" style={{ backgroundColor: 'var(--bg-primary)' }}>
        <Header />
        <main>
          <Routes>
            <Route path="/" element={<RankingsPage />} />
            <Route path="/simulator" element={<SimulatorPage />} />
            <Route path="/calendar" element={<CalendarPage />} />
            <Route path="*" element={<Navigate to="/" replace />} />
          </Routes>
        </main>
        <BottomNav />
      </div>
    </BrowserRouter>
  )
}

export default App
