import React from "react";

import { Routes, Route } from 'react-router-dom';

import Layout from "../components/Layout";
import List from '../pages/List';
import Dashboard from '../pages/Dashboard';

const AppRoutes: React.FC = () => (
    <Layout>
        <Routes>
            <Route path="/" element={<Dashboard />}/>
            <Route path="/dashboard" element={<Dashboard />}/>
            <Route path="/list/:type" element={<List />}></Route>
        </Routes>
    </Layout>
);

export default AppRoutes;
