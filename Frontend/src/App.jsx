import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import AppRoutes from "./routes/AppRoutes.jsx";
import { restoreSession } from "./redux/slices/authSlice.js";

const App = () => {
  const dispatch = useDispatch();
  const { sessionChecked } = useSelector((state) => state.auth);

  useEffect(() => {
    if (!sessionChecked) {
      dispatch(restoreSession());
    }
  }, [dispatch, sessionChecked]);

  return <AppRoutes />;
};

export default App;
