import React, { ReactNode } from "react";

import { Grid } from './styles'

import MainHeader from "../MainHeader";
import Aside from "../Aside";
import Content from "../Content";

interface BaseLayoutProps {
    children?: ReactNode;
  }

const Layout: React.FC<BaseLayoutProps> = ({children}) => {
    return (
        <Grid>
            <MainHeader />
            <Aside />
            <Content >
                {children}
            </Content>
        </Grid>
    );
}

export default Layout;