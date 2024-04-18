import { createBrowserRouter,RouterProvider,Route,Outlet } from "react-router-dom";
import Home from "./pages/Home"
import Table from "./pages/Table"
import Data from "./pages/Data"

const Layout =()=> {
  return(
    <>
    <Outlet></Outlet>
    </>
  );
};

const router = createBrowserRouter([
  {
    path: "/",
    element:<Layout/>,
    children:[
      {
        path:"/",
        element:<Home/>
      },
      {
        path:"/table",
        element:<Table/>
      },
      {
        path:"/data",
        element:<Data/>
      }
    ]
  },
]);

function App() {
  return (
    <div className="App">
      <div className="container">
        <RouterProvider router={router}/>
      </div>
    </div>
  );
}

export default App;
