import React, { Component } from 'react';
import { Button, Modal, Form, Input, Select, message, InputNumber, Radio } from 'antd';
import { connect } from 'dva/index';
import { routerRedux } from 'dva/router';

const FormItem = Form.Item;
const CollectionCreateForm = Form.create()(
  class extends React.Component {
    render() {
      const { visible, title, onCancel, onCreate, form, selectRecord, parentId } = this.props;
      const { getFieldDecorator } = form;
      const formItemLayout = {
        labelCol: {
          span: 5,
        },
        wrapperCol: {
          span: 19,
        },
      };
      if (this.props.tag_btn === '新增') {
        var groupType = parentId.length <= 0 ? 'COMPANY' : 'DEPARTMENT';
      } else {
        var groupType = selectRecord.groupType;
      }
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
            <FormItem {...formItemLayout} label="公司/部门:">
              {getFieldDecorator('groupName', {
                rules: [
                  { required: true, message: '公司或部门不能为空!' },
                  { max: 40, message: '公司或部门长度不能超过40个字符!' },
                ],
                initialValue: this.props.tag_btn !== '新增' ? selectRecord.title : '',
              })(<Input />)}
            </FormItem>
            <FormItem {...formItemLayout} label="组织类型:">
              {getFieldDecorator('groupTypeCh', {
                initialValue: groupType === 'COMPANY' ? '单位' : '部门',
              })(<Input disabled />)}
              {getFieldDecorator('groupType', {
                initialValue: groupType,
              })(<Input type="hidden" />)}
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
export class CompanyCollection extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      visible: false,
    };
  }
  componentWillMount() {
    // this.props.dispatch({
    //   type:manage/query,
    // })
  }
  componentWillReceiveProps(nextProps) {
    const next = nextProps.manage;
    if (next.resultCode !== 1000 && next.returnType === 'createCompany') {
      next.returnType = '';
      message.error(next.desc);
    }
    if (next.resultCode === 1000 && next.returnType === 'createCompany') {
      next.returnType = '';
      message.success('新增成功！');
      this.props.dispatch({
        type: 'manage/companyTree',
      });
    }
    if (next.resultCode !== 1000 && next.returnType === 'updateCompany') {
      next.returnType = '';
      message.error(next.desc);
    }
    if (next.resultCode === 1000 && next.returnType === 'updateCompany') {
      next.returnType = '';
      message.success('修改成功！');
      this.props.dispatch({
        type: 'manage/companyTree',
      });
    }
  }
  showModal = () => {
    if (this.props.tag_btn === '修改' && !this.props.parentId) {
      message.error('请选择修改节点！');
      return false;
    }

    this.setState({ visible: true });
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
  handleCreate = () => {
    const form = this.formRef.props.form;
    const { parentId, selectRecord } = this.props;
    form.validateFields((err, values) => {
      if (err) {
        return;
      }
      if (this.props.tag_btn === '新增') {
        values.parentId = !!parentId ? parentId : -1;
        values.companyId = !!selectRecord.companyId ? selectRecord.companyId : -1;
        this.props.dispatch({
          type: 'manage/createCompany',
          payload: {
            ...values,
          },
        });
      } else {
        values.groupId = parentId;
        this.props.dispatch({
          type: 'manage/updateCompany',
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
    if (this.props.tag_btn === '新增') {
      var titleTag = this.props.selectRecord.key === undefined ? '单位' : '部门';
    } else {
      var titleTag = this.props.selectRecord.groupType === 'COMPANY' ? '单位' : '部门';
    }
    return (
      <div>
        <Button
          className="collection_btn"
          type={this.props.tag_btn === '新增' ? 'primary' : ''}
          style={{ margin: '3px 0 0 8px', float: 'right' }}
          onClick={this.showModal}
        >
          {this.props.tag_btn}
        </Button>
        <CollectionCreateForm
          wrappedComponentRef={this.saveFormRef}
          visible={this.state.visible}
          title={`${this.props.tag_btn}${titleTag}`}
          tag_btn={this.props.tag_btn}
          selectRecord={this.props.selectRecord}
          parentId={this.props.parentId}
          onCancel={this.handleCancel}
          onCreate={this.handleCreate}
        />
      </div>
    );
  }
}
