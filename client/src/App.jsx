// import { BrowserRouter, Routes, Route } from "react-router-dom"
// import AppLayout from "./layout/AppLayout"

// import Dashboard from "./pages/Dashboard"
// import Articles from "./pages/Articles"
// import CreateArticle from "./pages/CreateArticle"
// import EditArticle from "./pages/EditArticle"
// import UpdateFromGoogle from "./pages/UpdateFromGoogle"

// export default function App() {
//   return (
//     <BrowserRouter>
//       <Routes>
//         <Route element={<AppLayout />}>
//           <Route path="/" element={<Dashboard />} />
//           <Route path="/articles" element={<Articles />} />
//           <Route path="/articles/new" element={<CreateArticle />} />
//           <Route path="/articles/:id/edit" element={<EditArticle />} />
//           <Route path="/articles/update-google" element={<UpdateFromGoogle />} />
//         </Route>
//       </Routes>
//     </BrowserRouter>
//   )
// }
import { useState } from "react"
import Sidebar from "./layout/Sidebar"
import Dashboard from "./pages/Dashboard"
import Articles from "./pages/Articles"
import CreateArticle from "./pages/CreateArticle"
import UpdateFromGoogle from "./pages/UpdateFromGoogle"
import { PAGES } from "./constants/pages"

export default function App() {
  const [activePage, setActivePage] = useState(PAGES.DASHBOARD)

  const renderPage = () => {
    switch (activePage) {
      case PAGES.ARTICLES:
        return <Articles />
      case PAGES.CREATE:
        return <CreateArticle />
      case PAGES.UPDATE_GOOGLE:
        return <UpdateFromGoogle />
      case PAGES.DASHBOARD:
      default:
        return <Dashboard />
    }
  }

  return (
    <div className="flex h-screen bg-muted/40">
      <Sidebar activePage={activePage} setActivePage={setActivePage} />
      <main className="flex-1 p-6 overflow-y-auto">
        {renderPage()}
      </main>
    </div>
  )
}
