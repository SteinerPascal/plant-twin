
import {
  ProSidebar,
  Menu,
  MenuItem,
  SidebarHeader,
  SidebarFooter,
  SidebarContent,
} from 'react-pro-sidebar';
import { FaGem, FaGithub,  } from 'react-icons/fa';

const Sidebar = ({ collapsed, rtl, toggled, handleToggleSidebar }:{collapsed:boolean,rtl:boolean,toggled:boolean,handleToggleSidebar:(value: boolean) => void;}) => {
  return (
    <ProSidebar
      rtl={rtl}
      collapsed={collapsed}
      toggled={toggled}
      breakPoint="md"
      onToggle={handleToggleSidebar}
    >
      <SidebarHeader>

      <div className="sidebar-header">
          <p>John Doe</p>
          <div className="d-flex justify-content-center">
            <div className="position-absolute bottom-0">
              <img
                src="./assets/images/user.jpg"
                alt="User profile"
                className="user-image"
              />
            </div>
          </div>
        </div>
      </SidebarHeader>

      <SidebarContent>
        <Menu iconShape="circle">
          <MenuItem icon={<FaGem />}>
            <span>Manager</span>
          </MenuItem>
          <MenuItem icon={<FaGem />}>
            <span>Digital Twin</span>  
          </MenuItem>
          <MenuItem icon={<FaGem />}>
            <span>TD editor</span>
          </MenuItem>
        </Menu>
      </SidebarContent>

      <SidebarFooter style={{ textAlign: 'center' }}>
        <div
          className="sidebar-btn-wrapper"
          style={{
            padding: '20px 24px',
          }}
        >
          <a
            href="https://github.com/azouaoui-med/react-pro-sidebar"
            target="_blank"
            className="sidebar-btn"
            rel="noopener noreferrer"
          >
            <FaGithub />
            <span style={{ whiteSpace: 'nowrap', textOverflow: 'ellipsis', overflow: 'hidden' }}>
              {'viesource'}
            </span>
          </a>
        </div>
      </SidebarFooter>
    </ProSidebar>
  );
};

export default Sidebar;