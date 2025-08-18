import { useContext } from "react";
import Navbar from "@/components/navbar";
import UserContext from "@/contexts/user";
import apiClient from "@/utils/client/apiClient";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

export default function Settings() {
  const [user, setUser] = useContext(UserContext);

  const saveUsername = async (user) => {
    const username = document.getElementById("username").value;
    try {
      const res = await apiClient.post("/updateUsername", { apiKey: user.apiKey, username: username });
      if (res.status === 200) {
        toast.success("Username updated");
        setUser(res.data.user);
      }
    } catch (err) {
      toast.error(err?.response?.data?.error);
    }
  };

  return (
    <>
      <Navbar />
      <ToastContainer position="top-center" theme="dark" />
      <div className="max-w-5xl mx-auto mt-32">
        {user && (
          <>
            <div className="my-6 p-2 bg-neutral-200">
              <h1 className="text-normal font-bold inline">Username</h1>
              <div className="flex mb-2 p-1 border border-neutral-300">
                <span className="py-2 inline-flex items-center pl-3 bg-white text-gray-300 text-lg dark:bg-dark2 dark:text-gray-600">
                  https://provable.art/
                </span>
                <input
                  id="username"
                  type="text"
                  className="flex-1 block w-full rounded-none sm:text-lg focus:outline-none focus:shadow-outline"
                  defaultValue={user.username}
                />
                <button
                  className="py-2 px-4 bg-black text-white cursor-pointer hover:bg-gray-800 font-bold"
                  onClick={() => saveUsername(user)}
                >
                  Save
                </button>
              </div>
            </div>
            {/* <div className="my-6 p-2 bg-neutral-200">
              <h1 className="text-normal font-bold inline">Wallets</h1>
            </div> */}
          </>
        )}
      </div>
    </>
  );
}
