import dynamic from "next/dynamic";
import React from "react";

const NoSsrChildren = ({ children }) => <>{children}</>;

export const NoSsr = dynamic(() => Promise.resolve(NoSsrChildren), {
  ssr: false,
});
