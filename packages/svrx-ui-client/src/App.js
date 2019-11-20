import React, { useState, useEffect } from 'react';
import {
  Layout,
  Row,
  Col,
  Divider,
  Icon,
} from 'antd';
import Directory from './components/Directory';
// import MixedSearch from './components/MixedSearch'; todo
import Settings from './components/Settings';
import './App.css';
import { getDirectory } from './services';

const { Header, Footer, Content } = Layout;

// const mock = {
//   searchResults: [
//     {
//       type: 'setting',
//       name: 'port',
//       group: 'COMMON',
//     },
//     {
//       type: 'plugin',
//       name: 'webpack',
//     },
//   ],
// };

const footerItems = [
  {
    name: 'GitHub', icon: 'github', url: 'https://github.com/svrxjs/svrx',
  },
  {
    name: 'Issue', icon: 'bug', url: 'https://github.com/svrxjs/svrx/issues',
  },
  {
    name: 'Docs', icon: 'api', url: 'https://docs.svrx.io/',
  },
  {
    name: 'Chat on Gitter',
    icon: 'message',
    url: 'https://gitter.im/svrxjs/svrx',
  },
];
const footer = footerItems.map((f, index) => (
  <span key={f.name}>
    <a href={f.url} target="_blank" rel="noopener noreferrer">
      <Icon type={f.icon}/>
      <span style={{ marginLeft: 5 }}>{f.name}</span>
    </a>
    {index === footerItems.length - 1
      ? null
      : <Divider type="vertical"/>
    }
  </span>
));

function App() {
  const [directoryArray, setDirectoryArray] = useState([]);

  useEffect(() => {
    (async () => {
      const arr = await getDirectory() || [];
      setDirectoryArray(arr);
    })();
  }, []);

  return (
    <Layout className="App">
      <Header className="header">SVRX Settings</Header>
      <Layout className="middle">
        <Row>
          <Col span={18} offset={3}>
            <Directory directoryArray={directoryArray}/>
            <Content className="content">
              {/* <MixedSearch results={mock.searchResults}/> */}
              <Settings />
            </Content>
          </Col>
        </Row>
      </Layout>
      <Footer className="footer">
        <Divider className="divider"/>
        {footer}
      </Footer>
    </Layout>
  );
}

export default App;
