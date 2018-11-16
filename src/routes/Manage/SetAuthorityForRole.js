import { Modal, Form, Checkbox, Row, Col } from 'antd';
const CheckboxGroup = Checkbox.Group;
const FormItem = Form.Item;
import { connect } from 'dva';
import styles from './Manage.less';
import { Tree } from 'antd';
const TreeNode = Tree.TreeNode;
import jqy from 'jquery';
import { reduce } from 'zrender/lib/core/util';

@connect(({ manage, loading }) => ({
  manage,
  submitting: loading.effects['manage/searchRole'],
}))
@Form.create()
export default class SetAuthorityForRole extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      expandedKeys: [],
      autoExpandParent: true,
      checkedKeys: [],
      selectedKeys: [],
    };
  }
  componentDidMount() {}
  componentWillReceiveProps(nextProps) {
    this.setState({
      checkedKeys: nextProps.defaultSelectedKeys,
      expandedKeys: nextProps.defaultSelectedKeys,
      selectedKeys: nextProps.defaultSelectedKeys,
    });
  }
  onExpand = expandedKeys => {
    this.setState({
      expandedKeys,
      autoExpandParent: false,
    });
  };
  onCheck = (checkedKeys, e) => {
    this.dealCheckKeys(checkedKeys, e);
    this.setState({ checkedKeys });
    this.props.keyOnChange(checkedKeys.checked, true);

    if (checkedKeys.checked.length < 1) {
      jqy('#remind').text('至少选择一个权限！');
    } else {
      jqy('#remind').text('');
    }
  };
  onSelect = (selectedKeys, info) => {
    this.setState({ selectedKeys });
  };

  renderTreeNodes = data => {
    return (
      data &&
      data.map(item => {
        if (item.children) {
          return (
            <TreeNode title={item.title} key={item.key} dataRef={item}>
              {this.renderTreeNodes(item.children)}
            </TreeNode>
          );
        }
        return <TreeNode {...item} />;
      })
    );
  };

  //如果选择节点，则父节点以及所有子节点都选中
  //如果取消节点，则所有子节点都取消
  dealCheckKeys = (checkedKeys, e) => {
    var node = e.node.props.dataRef;
    if (e.checked) {
      //选中
      var parentIds = node.parentIds;
      for (var i = 0; i < parentIds.length; i++) {
        this.pushSet(checkedKeys.checked, parentIds[i]);
      }
      this.pushChild(checkedKeys.checked, node);
    } else {
      //取消
      this.popChild(checkedKeys.checked, node);
    }
  };

  //将子节点都选中
  pushChild = (list, node) => {
    this.pushSet(list, node.key);
    for (var i = 0; i < node.children.length; i++) {
      this.pushChild(list, node.children[i]);
    }
  };

  //将子节点都取消选中
  popChild = (list, node) => {
    this.popSet(list, node.key);
    for (var i = 0; i < node.children.length; i++) {
      this.popChild(list, node.children[i]);
    }
  };

  //选中
  pushSet = (list, item) => {
    var isHave = false;
    for (var i = 0; i < list.length; i++) {
      if (list[i] === item) {
        isHave = true;
      }
    }
    if (!isHave) {
      list.push(item);
    }
  };

  //取消选中
  popSet = (list, item) => {
    for (var i = 0; i < list.length; i++) {
      if (list[i] === item) {
        //元素不会重复 所有只需要删除一个即可
        list.splice(i, 1);
        return;
      }
    }
  };

  render() {
    const { visible, onCancel, onCreate, form, defaultSelectedKeys, treeNodes } = this.props;
    const { getFieldDecorator } = form;

    return (
      <Modal visible={visible} title="分配权限" okText="保存" onCancel={onCancel} onOk={onCreate}>
        <Form>
          <FormItem>
            {getFieldDecorator('permissions')(
              <Tree
                checkable
                checkStrictly
                onExpand={this.onExpand}
                expandedKeys={this.state.expandedKeys}
                autoExpandParent={this.state.autoExpandParent}
                onCheck={this.onCheck}
                checkedKeys={this.state.checkedKeys}
                onSelect={this.onSelect}
                selectedKeys={this.state.selectedKeys}
              >
                {this.renderTreeNodes(treeNodes)}
              </Tree>
            )}
          </FormItem>
          <FormItem>
            <div id="remind" style={{ color: 'red', marginLeft: '10px' }} />
          </FormItem>
        </Form>
      </Modal>
    );
  }
}
