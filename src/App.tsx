import React , {useEffect} from 'react';
import { selectUser , login , logout } from './redux/userSlice';
import { useSelector, useDispatch } from 'react-redux';
import './App.css';
 import {auth} from "./firebase";
import Auth from './components/Auth';
import Main from './components/Main';

const App:React.FC = () => {
  const user = useSelector(selectUser);
  const dispatch = useDispatch();

  useEffect(()=>{
    const unSub = auth.onAuthStateChanged((authUser) =>{
      if (authUser){
        dispatch(
          login({
            uid:authUser.uid,
            userName:authUser.displayName,
            avatarImage:authUser.photoURL,
          })
        )
      } else {
        dispatch(
          logout()
        )
      }
    })
    return ()=>{
      unSub();
    }
  },[dispatch])
  return (
    <>
    {user.uid ? (
    <div className="App">
      <Main />
      </div>
      )
      :
      <Auth />
      }
      </>
  );
}

export default App;
