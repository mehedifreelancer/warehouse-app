
import './App.css'
function App() {



  return (
    <div className="layout-wrapper">

      <main className="z-[10px] main-content p-4 min-h-screen dark:bg-gray-900 dark:text-white w-full">
        <h1 className="text-2xl font-bold">Welcome to the App {process.env.REACT_APP_API_BASE_URL}</h1>
      </main>
    </div>
  )
}

export default App
