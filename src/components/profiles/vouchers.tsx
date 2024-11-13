import React, { useState } from "react";
import { Tabs } from 'antd'; // Importing Tabs component from antd
import './profile.scss'

const { TabPane } = Tabs;

function Vouchers() {
    const onChange = (key) => {
        console.log('Tab changed to:', key);
    };

    return (
        <Tabs defaultActiveKey="1" onChange={onChange}>
            <TabPane tab='Tab 1' key='1'>
                test 1
            </TabPane>
            <TabPane tab='Tab 2' key='2'>
                test 2
            </TabPane>
            <TabPane tab='Tab 3' key='3'>
                test 3
            </TabPane>
        </Tabs>
    );
}

export default Vouchers;
