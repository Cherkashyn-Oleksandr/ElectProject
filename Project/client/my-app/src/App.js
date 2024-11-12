import { createBrowserRouter,RouterProvider,Route,Outlet } from "react-router-dom";
import Home from "./pages/Home"
import AnalogHome from "./pages/AnalogHome"
import Table from "./pages/Table"
import Data from "./pages/Data"
import Data from "./pages/AnalogData"
import Login from "./pages/Login"

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
        path:"/analog",
        element:<AnalogHome/>
      },
      {
        path:"/table",
        element:<Table/>
      },
      {
        path:"/data",
        element:<Data/>
      },
      {
        path:"/analogdata",
        element:<AnalogData/>
      },
      {
        path:"/login",
        element:<Login/>
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
