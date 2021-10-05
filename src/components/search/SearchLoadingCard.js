import React from "react";
import { Card, Col, Skeleton } from 'antd';


export const SearchLoadingCard = ({i}) => {
    return(
        <>
            <Col span={6} className="mt-2 mb-2" key = {i}>
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
