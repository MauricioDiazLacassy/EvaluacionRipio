import React  from 'react';
import Home from './pages/Home'
import Login from './pages/Login'
import Register from './pages/Register'
import Mine from './pages/Mine'
import HistoryTransactions from './pages/HistoryTransactions'
import Coins from './pages/Coins'
import Transfer from './pages/Transfer'
import {AppContainer} from './styles/App'
import {Switch, Route } from 'react-router-dom';

function App() {

  return (
    <AppContainer>
          <Switch>
                <Route exact path='/' component={Home} />
                <Route exact path='/login' component={Login} />
                <Route exact path='/registro' component={Register} />
                <Route exact path='/historial-transacciones' component={HistoryTransactions} />
                <Route exact path='/transferir' component={Transfer} />
                <Route exact path='/minar-blockchain' component={Mine} />
                <Route exact path='/monedas' component={Coins} />
          </Switch>
    </AppContainer>    
  );
  
}

export default App;
