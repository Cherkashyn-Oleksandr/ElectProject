import { createBrowserRouter,RouterProvider,Route,Outlet } from "react-router-dom";
import Home from "./pages/Home"

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
