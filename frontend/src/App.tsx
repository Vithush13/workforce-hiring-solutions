import { Routes, Route, Navigate, BrowserRouter } from 'react-router-dom'
import SignIn from './Candidate/SignIn'
import ExportData from './Candidate/ExportData'
import DashboardLayout from './components/DashboardLayout'

function App() {
  return (
    <BrowserRouter>
      <Routes>
        {/* DEFAULT ROUTE */}
        <Route
          path="/"
          element={<Navigate to="/" />} 
        />

        <Route
          path="/signin"
          element={<SignIn />}
        />
       
        <Route element={<DashboardLayout />}>
          <Route path="/exportdata" element={<ExportData />} />
        </Route>
        
      </Routes>
    </BrowserRouter>
  )
}

export default App