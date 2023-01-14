
import React, { useState } from "react";
import Header from "./Header";
import Sidebar from "./sidebar/Sidebar";

const Layout = ({ children }:{children:any}) => {
    const [rtl, setRtl] = useState(false);
    const [toggled, setToggled] = useState(false);
    const [collapsed, setCollapsed] = useState(false);
  
    const handleRtlChange = (checked:any) => {
      setRtl(checked);
      //setLocale(checked ? "ar" : "en");
    };
  
    const handleToggleSidebar = (value:boolean) => {
      setToggled(value);
    };


    const handleCollapsedChange = (checked:boolean) => {
        setCollapsed(checked);
      };
    
    return (
    <React.Fragment>
    <div className={`app ${rtl ? "rtl" : ""} ${toggled ? "toggled" : ""}`}>
        <Sidebar  
          rtl={rtl}
          toggled={toggled}
          handleToggleSidebar={handleToggleSidebar}
          collapsed={collapsed}
        />
        <main >
        <Header toggled={toggled}
          collapsed={collapsed}
          rtl={rtl}
          handleToggleSidebar={handleToggleSidebar}
          handleCollapsedChange={handleCollapsedChange}
          handleRtlChange={ handleRtlChange} />
        <div className="app-content"style={{width:"100%",height:"100%"}}>{children}</div>
      </main>
    </div>
    </React.Fragment>
    );


};
export default Layout;