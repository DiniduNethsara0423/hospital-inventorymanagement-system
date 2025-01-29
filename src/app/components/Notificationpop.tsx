const Notificationpop = ({ message, type }: { message: string; type: "success" | "warning" }) => {
    return (
      <div
        className={`fixed top-20 right-5 p-4 rounded-lg shadow-lg transition-transform ${
          type === "success" ? "bg-green-500 text-white" : "bg-yellow-500 text-black"
        }`}
      >
        {message}
      </div>
    );
  };
  
  export default Notificationpop