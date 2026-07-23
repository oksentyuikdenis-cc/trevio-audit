import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { Specimen } from './Specimen'
import '../styles/base.css'
import './specimen.css'

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <Specimen />
  </StrictMode>,
)
