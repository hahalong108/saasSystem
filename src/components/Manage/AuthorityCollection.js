import React, { Component } from 'react';
import { Button, Modal, Form, Input, Select, message, InputNumber, Radio } from 'antd';
import { connect } from 'dva/index';
import { routerRedux } from 'dva/router';

const FormItem = Form.Item;
const CollectionCreateForm = Form.create()(
  class extends React.Component {
    render() {
      const { visible, title, onCancel, onCreate, form, grade } = this.props;
      const { getFieldDecorator } = form;
      const formItemLayout = {
        labelCol: {
          span: 4,
        },
        wrapperCol: {
          span: 20,
        },
      };
      return (
        <Modal
          visible={visible}
          title={title}
          okText="保存"
          onCancel={onCancel}
          onOk={onCreate}
          destroyOnClose
        >
          <Form layout="horizontal">
            <FormItem {...formItemLayout} label="权限名称">
              {getFieldDecorator('permissionname', {
                rules: [
                  { required: true, message: '权限名称不能为空!' },
                  { max: 40, message: '权限名称长度不能超过40个字符!' },
                ],
              })(<Input />)}
            </FormItem>
            <FormItem {...formItemLayout} label="序列号">
              {getFieldDecorator('indexNo', {
                rules: [{ required: true, message: '序列号不能为空!' }],
              })(<InputNumber min={1} max={127} style={{ width: '100%' }} />)}
            </FormItem>
            <FormItem {...formItemLayout} label="类型">
              {getFieldDecorator('grade', {
                rules: [{ required: true, message: '类型不能为空!' }],
                initialValue: grade.toString() || undefined,
              })(
                <Select>
                  <Select.Option value="1">模块</Select.Option>
                  <Select.Option value="2">菜单</Select.Option>
                  <Select.Option value="3">页面</Select.Option>
                  <Select.Option value="4">按钮</Select.Option>
                </Select>
              )}
            </FormItem>
            <FormItem {...formItemLayout} label="跳转地址">
              {getFieldDecorator('href', {
                rules: [{ max: 40, message: '跳转地址长度不能超过40个字符!' }],
              })(<Input />)}
            </FormItem>
            <FormItem {...formItemLayout} label="图标">
              {getFieldDecorator('icon', {
                rules: [{ max: 40, message: '图标长度不能超过40个字符!' }],
              })(<Input />)}
            </FormItem>
            <FormItem {...formItemLayout} label="权限标签">
              {getFieldDecorator('tag', {
                rules: [{ max: 40, message: '权限标签长度不能超过40个字符!' }],
              })(<Input />)}
            </FormItem>
            <FormItem {...formItemLayout} label="权限描述">
              {getFieldDecorator('description', {
                rules: [{ max: 50, message: '权限描述长度不能超过50个字符!' }],
              })(<Input type="textarea" />)}
            </FormItem>
          </Form>
        </Modal>
      );
    }
  }
);

@connect(({ manage, loading }) => ({
  manage,
  submitting: loading.effects['manage/createPermission'],
}))
export class AuthorityCollection extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      visible: false,
      grade: '',
    };
  }
  componentWillMount() {
    // this.props.dispatch({
    //   type:manage/query,
    // })
  }
  componentWillReceiveProps(nextProps) {
    const next = nextProps.manage;
    if (
      next.resultCode !== 1000 &&
      isNaN(next.resultCode) &&
      next.returnType === 'createPermission'
    ) {
      next.resultCode = '0';
      message.error(next.desc);
    }
    if (next.resultCode === 1000 && next.returnType === 'createPermission') {
      next.resultCode = '0';
      message.success(next.desc);
      this.props.dispatch({
        type: 'manage/initRoleTree',
      });
    }
    if (
      next.resultCode !== 1000 &&
      isNaN(next.resultCode) &&
      next.returnType === 'updatePermission'
    ) {
      next.resultCode = '0';
      message.error(next.desc);
    }
    if (next.resultCode === 1000 && next.returnType === 'updatePermission') {
      next.resultCode = '0';
      message.success(next.desc);
      this.props.dispatch({
        type: 'manage/initRoleTree',
      });
    }
    if (next.resultCode === 1000 && next.returnType === 'permissionQuery') {
      // next.returnType = "";
      const form = this.formRef.props.form;
      this.setState({
        grade: next.queryDate[0].grade,
      });
      form.setFieldsValue({
        permissionname: next.queryDate[0].permissionName,
        indexNo: next.queryDate[0].indexNo,
        // "grade":next.queryDate[0].grade,
        href: next.queryDate[0].href,
        icon: next.queryDate[0].icon,
        tag: next.queryDate[0].tag,
        description: next.queryDate[0].description,
      });
    }
  }
  showModal = () => {
    if (this.props.parentId !== '') {
      const form = this.formRef.props.form;
      form.resetFields();
      this.setState({
        grade: '',
        visible: true,
      });
    }
    if (this.props.tag_btn === '修改') {
      this.props.dispatch({
        type: 'manage/selectPermissionName',
        payload: {
          permissionId: this.props.parentId,
        },
      });
    }
  };

  handleCancel = () => {
    this.setState({ visible: false });
  };

  errMsg = () => {
    if (this.props.parentId === '-1') {
      message.error(`根节点不允许修改`);
    } else {
      message.error(`请选择${this.props.tag_btn}节点`);
    }
  };
  // submitErrMsg = (e) =>{
  //   message.error(e)
  // }
  // submitSuccessMsg = (e) =>{
  //   message.success(e)
  // }
  // 提交
  handleCreate = () => {
    const form = this.formRef.props.form;
    form.validateFields((err, values) => {
      if (err) {
        return;
      }
      if (this.props.tag_btn === '新增') {
        values.parentId = this.props.parentId;
        this.props.dispatch({
          type: 'manage/createPermission',
          payload: {
            ...values,
          },
        });
      } else {
        values.permissionId = this.props.parentId;
        this.props.dispatch({
          type: 'manage/updatePermission',
          payload: {
            ...values,
          },
        });
      }
      form.resetFields();
      this.setState({ visible: false });
    });
  };
  saveFormRef = formRef => {
    this.formRef = formRef;
  };
  render() {
    return (
      <div>
        <Button
          className="collection_btn"
          type={this.props.tag_btn === '新增' ? 'primary' : ''}
          style={{ margin: '3px 0 0 8px', float: 'right' }}
          onClick={
            this.props.parentId === '-1' && this.props.tag_btn === '修改'
              ? this.errMsg
              : this.showModal
          }
        >
          {this.props.tag_btn}
        </Button>
        <CollectionCreateForm
          wrappedComponentRef={this.saveFormRef}
          visible={this.state.visible}
          title={`${this.props.tag_btn}权限`}
          grade={this.state.grade}
          onCancel={this.handleCancel}
          onCreate={this.handleCreate}
        />
      </div>
    );
  }
}
