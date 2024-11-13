import React, { useState } from "react";
import { Tabs } from 'antd'; // Importing Tabs component from antd
import './profile.scss'

const { TabPane } = Tabs;

function Purchases() {
    const onChange = (key) => {
        console.log('Tab changed to:', key);
    };

    return (
        <Tabs defaultActiveKey="1" onChange={onChange}>
            <TabPane tab='All' key='1'>
                test 1
            </TabPane>
            <TabPane tab='To Pay' key='2'>
                test 2
            </TabPane>
            <TabPane tab='To Ship' key='3'>
                test 3
            </TabPane>
            <TabPane tab='To Receive' key='4'>
                test 4
            </TabPane>
            <TabPane tab='Completed' key='5'>
                test 5
            </TabPane>
            <TabPane tab='Cancelled' key='6'>
                test 6
            </TabPane>
            <TabPane tab='Return/Refund' key='7'>
                test 7
            </TabPane>
        </Tabs>
    );
}

export default Purchases;
