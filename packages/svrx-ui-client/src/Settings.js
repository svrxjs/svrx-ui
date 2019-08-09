import React from 'react';
import {
  Layout,
} from 'antd';

const { Sider, Content } = Layout;

function Settings() {
  return (
    <Layout className="Settings">
      <Sider></Sider>
      <Content></Content>
    </Layout>
  );
}

export default Settings;
