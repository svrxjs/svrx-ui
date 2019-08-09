import React from 'react';
import {
  Layout,
} from 'antd';
import Settings from './Settings';
import './App.css';

const { Header, Footer, Content } = Layout;

function App() {
  return (
    <Layout className="App">
      <Header>SVRX Settings</Header>
      <Layout>
        <Content>
          <Settings />
        </Content>
      </Layout>
      <Footer>footer</Footer>
    </Layout>
  );
}

export default App;
