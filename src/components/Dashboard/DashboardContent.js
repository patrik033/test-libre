import React from "react";
import { Card, Row, Col } from "antd";

const DashboardContent = () => {
  return (
    <Row gutter={[16, 16]}>
      <Col span={8}>
        <Card title="Antal Användare" bordered={false}>
          345
        </Card>
      </Col>
      <Col span={8}>
        <Card title="Sålda Fastigheter" bordered={false}>
          120
        </Card>
      </Col>
      <Col span={8}>
        <Card title="Senaste Rapport" bordered={false}>
          23 November 2024
        </Card>
      </Col>
    </Row>
  );
};

export default DashboardContent;
