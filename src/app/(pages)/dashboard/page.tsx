import React from "react";
import Navbar from "@/app/components/navbar";
import Header from "@/app/components/header";
function page() {
  return (
    <div className="flex w-full h-screen">
      <div className="w-[20%]">
        <Navbar />
      </div>
      <div className="w-[80%]">
        <Header />
        <div>body</div>
      </div>
    </div>
  );
}

export default page;
