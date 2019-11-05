import React from 'react';
// import { useDispatch, useMappedState } from 'redux-react-hook';
import {
  Layout,
  Tree,
} from 'antd';

const { Sider, Content } = Layout;
const { TreeNode } = Tree;

export default function Settings() {
  // const [newTodo, setNewTodo] = useState('');
  // const dispatch = useDispatch();

  return (
    <Layout style={{ margin: '20px 0' }}>
      <Sider theme="light">
        <Tree
          defaultExpandedKeys={['0-0-0', '0-0-1']}
          defaultSelectedKeys={['0-0-0', '0-0-1']}
          defaultCheckedKeys={['0-0-0', '0-0-1']}
          // onSelect={this.onSelect}
        >
          <TreeNode title="parent 1" key="0-0">
            <TreeNode title="parent 1-0" key="0-0-0" disabled>
              <TreeNode title="leaf" key="0-0-0-0" disableCheckbox />
              <TreeNode title="leaf" key="0-0-0-1" />
            </TreeNode>
            <TreeNode title="parent 1-1" key="0-0-1">
              <TreeNode title={<span style={{ color: '#1890ff' }}>sss</span>} key="0-0-1-0" />
            </TreeNode>
          </TreeNode>
        </Tree>
      </Sider>
      <Content>settings</Content>
    </Layout>
  );
}
