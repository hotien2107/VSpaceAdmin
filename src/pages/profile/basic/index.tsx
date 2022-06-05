import { PageContainer } from '@ant-design/pro-layout';
import UpdateProfileProxy from '@/services/proxy/users/update-user';
import { Card, Row, Col } from 'antd';
import { FC, useState } from 'react';
import { Button, message, Input, Drawer, Avatar } from 'antd';
import CreateForm from './components/CreateForm';
import { UserOutlined } from '@ant-design/icons'
import { useEffect, } from 'react'
import ProfileProxy from '../../../services/proxy/users/get-profile'
import { useAppDispatch, useAppSelector } from '../../../stores'
import {
  setAuthenticated,
  setUserInfo,
  userSelectors,
} from '../../../stores/auth-slice'
// import { setUserInfo, userSelectors } from "../../stores/auth-slice";
import { ProxyStatusEnum } from '../../../types/http/proxy/ProxyStatus'
import { EditProfileFormValuesInterface } from './data';
const Basic: FC = () => {

  const dispatch = useAppDispatch();
  const userInfo = useAppSelector(userSelectors.getUserInfo)
  const [isChangingPassword, setIsChangingPass] = useState<boolean>(false);


  const handleChangeProfile = (values: EditProfileFormValuesInterface) => {
    if (values.avatar === '') {
      message.error('Avatar is require')
    } else {
      UpdateProfileProxy({
        name: values.name,
        phone: values.phone,
        avatar: values.avatar,
      })
        .then((res) => {
          if (res.status === ProxyStatusEnum.FAIL) {
            message.error(res.message ?? 'update fail')
          }

          if (res.status === ProxyStatusEnum.SUCCESS) {
            dispatch(setUserInfo(res?.data.userInfo))
            message.success('update success')
            setIsChangingPass(!isChangingPassword)
          }
        })
        .catch((err) => {
          message.error(err.message ?? 'update fail')
        })
        .finally(() => {})
    }
  }

  useEffect(() => {
    ProfileProxy()
      .then((res) => {
        if (res.status === ProxyStatusEnum.FAIL) {
          message.error(res.message ?? 'Load data fail!')
        }

        if (res.status === ProxyStatusEnum.SUCCESS) {
          dispatch(setUserInfo(res?.data.userInfo))
        }
      })
      .catch((err) => {
        message.error(err.message ?? 'Load hihi fail!')
      })
      .finally(() => { })
  }, [dispatch])

  const padTo2Digits = (num: number) => {
    return num.toString().padStart(2, '0')
  }

  const parseStringToDate = (dateSTr: any) => {
    if (dateSTr) {
      const date = new Date(dateSTr)
      return [
        padTo2Digits(date.getDate()),
        padTo2Digits(date.getMonth() + 1),
        date.getFullYear(),
      ].join('/')
    }
    return ''
  }

  return (
    <PageContainer>
       {userInfo && (<CreateForm
        modalVisible={isChangingPassword}
        handleModalVisible={setIsChangingPass}
        onSubmit={handleChangeProfile}
        userInfo={userInfo}
      />)}
      <Card bordered={false}>
        <Row style={{ marginBottom: "2rem" }}>
          <Col span={6}>
            {userInfo.avatar === '' ? (
              <Avatar size={120} icon={<UserOutlined />} />
            ) : (
              <img
                src={userInfo.avatar}
                alt=""
                style={{ width: "15rem", height: "15rem", borderRadius: "50%", objectFit: "cover", overflow: "hidden" }}
              />
            )}
          </Col>
        </Row>

        <Row>
          <Col span={6}>
            <b>Name</b>
          </Col>
          <Col span={18}>
            : {userInfo?.name}
          </Col>
        </Row>
        <Row>
          <Col span={6}>
            <b>Email</b>
          </Col>
          <Col span={18}>
            : {userInfo?.email}
          </Col>
        </Row>
        <Row>
          <Col span={6} >
           <b> Phone number</b>
          </Col>
          <Col span={18}>
            : {userInfo?.phone}
          </Col>
        </Row>
        <Row>
          <Col span={6} >
            <b>Joined date</b>
          </Col>
          <Col span={18} >
            : {parseStringToDate(userInfo.createdAt)}
          </Col>
        </Row>
        {/* <Row style={{margin: "2rem 0"}}>
          <Col span={4}>
            <Button
              type='primary'
              onClick={() => {
                setIsChangingPass(true)
              }}
            >
              Change Profile
            </Button>
          </Col>
          <Col>
            <Button
              type='primary'
              onClick={() => {
              }}
            >
              Change Password
            </Button>
          </Col>
        </Row> */}
      </Card>
    </PageContainer>
  );
};

export default Basic;
