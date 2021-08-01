import React from "react";
import {useDispatch, useSelector} from "react-redux";
import {selectUser} from "../redux/userSlice";
import {logout} from "../redux/userSlice";

export const Main = () => {
  const dispatch = useDispatch();
  const user = useSelector(selectUser);
  return (
    <div>
      <span onClick={() => dispatch(logout())}>
        <h1>Main</h1>
        <p>{user.userName}</p>
      </span>
    </div>
  );
};

export default Main;
