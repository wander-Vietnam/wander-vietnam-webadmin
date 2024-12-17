import React, { useState } from "react";
import logo from "../assets/images/logo.png";
import { useDispatch } from "react-redux";
import { login } from "../redux/authSlice";
import { AppDispatch } from "../redux/store";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

const Login: React.FC = () => {
  const [phoneOrEmail, setPhoneOrEmail] = useState("");
  const [password, setPassword] = useState("");
  const dispatch = useDispatch<AppDispatch>();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const resultAction = await dispatch(login({ phoneOrEmail, password }));
      if (login.fulfilled.match(resultAction)) {
        toast.success("Đăng nhập thành công!", {
          position: "top-right",
          autoClose: 3000,
          hideProgressBar: false,
          closeOnClick: true,
          pauseOnHover: true,
          draggable: true,
          progress: undefined,
        });
      } else {
        toast.error(`Đăng nhập thất bại: tài khoản hoặc mật khẩu không chính xác!`, {
          position: "top-right",
          autoClose: 5000,
          hideProgressBar: false,
          closeOnClick: true,
          pauseOnHover: true,
          draggable: true,
          progress: undefined,
        });
      }
    } catch (error) {
      toast.error("Đăng nhập thất bại: tài khoản hoặc mật khẩu không chính xác!", {
        position: "top-right",
        autoClose: 5000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
        progress: undefined,
      });
    }
  };

  return (
    <div className="flex min-h-screen items-center justify-center bg-gray-100">
      <div className="bg-white p-8 rounded shadow-md w-full max-w-md">
        <img src={logo} alt="Logo" className="w-24 mx-auto mb-6" />
        <h2 className="text-2xl font-semibold text-gray-700 mb-6 text-center">
          Đăng nhập
        </h2>
        <form onSubmit={handleSubmit}>
          <div className="mb-4">
            <label
              className="block text-gray-600 text-sm font-medium mb-2"
              htmlFor="email"
            >
              Email
            </label>
            <input
              type="email"
              id="email"
              value={phoneOrEmail}
              onChange={(e) => setPhoneOrEmail(e.target.value)}
              className="w-full px-3 py-2 border rounded focus:outline-none focus:ring-2 focus:ring-blue-400"
              placeholder="Nhập email của bạn"
            />
          </div>
          <div className="mb-6">
            <label
              className="block text-gray-600 text-sm font-medium mb-2"
              htmlFor="password"
            >
              Mật khẩu
            </label>
            <input
              type="password"
              id="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full px-3 py-2 border rounded focus:outline-none focus:ring-2 focus:ring-blue-400"
              placeholder="Nhập mật khẩu"
            />
          </div>
          <button
            type="submit"
            className="w-full bg-blue-500 hover:bg-blue-600 text-white font-semibold py-2 px-4 rounded focus:outline-none focus:ring-2 focus:ring-blue-400"
          >
            Đăng nhập
          </button>
        </form>
      </div>
      <ToastContainer />
    </div>
  );
};

export default Login;
