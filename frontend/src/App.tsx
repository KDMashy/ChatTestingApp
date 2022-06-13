import React, { useEffect, useState } from 'react';
import { BrowserRouter as Router, Routes, Route} from 'react-router-dom';
import Chats from './pages/Chats';
import Index from './pages/Index';
import NotFound from './pages/NotFound';

function App() {

  const [logged, setLogged] = useState(false);

  useEffect(() => {
    let isLoggedIn = localStorage.getItem('loggedIn');
    if(isLoggedIn === 'true'){
      setLogged(true);
    } else {
      setLogged(false);
    }
  }, []);

  return (
    <div className="App">
        <Router>
          <Routes>
            {
              logged ? [
                <Route path='/' element={<NotFound />} key={0} />,
                <Route path='/chat' element={<Chats />} key={1}/>
              ]
              : [
                <Route path='/' element={<Index />} key={2}/>,
              ]
            }
            <Route path='*' element={<NotFound />} />
          </Routes>
        </Router>
    </div>
  );
}

export default App;
