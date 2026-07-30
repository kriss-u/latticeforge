import { Route, Routes } from "react-router-dom"
import Layout from "@/components/Layout"
import About from "@/pages/About"
import Home from "@/pages/Home"
import { routes } from "@/routes"

export default function App() {
  return (
    <Routes>
      <Route element={<Layout />}>
        <Route index element={<Home />} />
        <Route path={routes.about} element={<About />} />
      </Route>
    </Routes>
  )
}
