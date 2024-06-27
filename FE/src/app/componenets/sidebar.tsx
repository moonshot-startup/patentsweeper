import React from "react";
import { FaHome, FaEnvelope } from "react-icons/fa";
import { HiOutlineClipboardDocumentList } from "react-icons/hi2";
import { HiOutlineDocumentSearch } from "react-icons/hi";
import HouseIcon  from '../icons/house';
import "./Sidebar.css";

const Sidebar: React.FC = () => {
  return (
    <div className="sidebar">
      <HiOutlineClipboardDocumentList className="main-icon" />
      <span className="title">Patent Sweeper</span>
      <nav>
        <ul>
          <li>
            <a href="/">
              <HouseIcon />
            </a>
          </li>
          <li>
            <a href="/dashboard/upload">
              <HiOutlineDocumentSearch className="sidebar-icon" />
            </a>
          </li>
          {/* <li>
            <a href="/profile">
              <FaEnvelope className="sidebar-icon" />
            </a>
          </li> */}
        </ul>
      </nav>
    </div>
  );
};

export default Sidebar;
