import React from 'react';
import 'antd/dist/antd.css';

import queries from './serverQueries';
import {
  PrivateRoute,
  CommonRoute,
  AuthRoute,
  TopicRoute,
  SubsectionRoute,
  SearchRoute,
  ArticlesRoute,
} from './routes';
import Context from './components/Context';
import Header from './components/layouts/Header';
import Profile from './components/Profile';
import SearchForm from './components/Main/SearchForm';

class App extends React.Component {
  constructor(props) {
    super(props);
    let initialState = { user: {}, isLogin: false };
    if (localStorage.getItem('user')) {
      const user = JSON.parse(localStorage.getItem('user') || {});
      initialState = { user, isLogin: true };
    }
    this.state = { ...initialState };
  }

  changeLoginState = () => {
    this.setState(({ isLogin }) => ({
      isLogin: !isLogin,
    }));
  };

  changeUserState = data => {
    this.setState({ user: { ...data } });
  };

  logOut = async () => {
    localStorage.removeItem('user');
    queries.logOut();
    this.setState(() => ({ isLogin: false, user: {} }));
  };

  render() {
    const { isLogin } = this.state;

    return (
      <Context.Provider
        value={{
          changeUserState: this.changeUserState,
          changeLoginState: this.changeLoginState,
          logOut: this.logOut,
          ...this.state,
        }}
      >
        <Header />
        <SearchForm />
        <CommonRoute />
        <AuthRoute isLogin={isLogin} />
        <PrivateRoute isLogin={isLogin} path="/profile" component={Profile} />
        <TopicRoute />
        <SubsectionRoute />
        <SearchRoute />
        <ArticlesRoute />
      </Context.Provider>
    );
  }
}

export default App;
