import { Route, Routes } from "react-router-dom"
import Layout from "@/components/Layout"
import Home from "@/pages/Home"
import Contact from "@/pages/Contact"
import PrivacyPolicy from "@/pages/PrivacyPolicy"

export default function App() {
  return (
    <Routes>
      <Route element={<Layout />}>
        <Route index element={<Home />} />
        <Route path="contact" element={<Contact />} />
        <Route path="privacy-policy" element={<PrivacyPolicy />} />
      </Route>
    </Routes>
  )
}
