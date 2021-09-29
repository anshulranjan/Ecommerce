import React from "react";
import { Card, Col, Skeleton } from 'antd';


export const LoadingCard = ({i}) => {
    return(
        <>
            <Col span={4} key = {i}>
            <Card
            hoverable
            bordered={false}
            style={{ width: 240, height: 400 }}
            className="p-3"
            >
            <Skeleton active/>
            </Card>
            </Col>
        </>
    )
}
