import React, { ReactNode } from "react";
import Header from "./Header";

type Props = {
  children: ReactNode;
};

const Layout: React.FC<Props> = (props) => (
  <div>
    <Header />
    <div className="px-2 sm:px-4 py-2.5 mt-8">
      <div className="container mx-auto flex flex-wrap items-center justify-between">
        {props.children}
      </div>
    </div>
  </div>
);

export default Layout;