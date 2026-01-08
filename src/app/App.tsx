import { RouterProvider } from "react-router-dom";
import { router } from "./router";
import { GlobalErrorDialog } from "./GlobalErrorDialog";

export function App() {
  return (
    <>
      <RouterProvider router={router} />
      <GlobalErrorDialog />
    </>
  );
}
