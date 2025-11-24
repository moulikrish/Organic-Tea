import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import {
  HiUsers,
  HiShoppingBag,
  HiClipboardList,
  HiPlusCircle,
  HiPhotograph,
} from "react-icons/hi";

export default function Admin() {
  const navigate = useNavigate();

  const [userCount, setUserCount] = useState(0);
  const [productCount, setProductCount] = useState(0);
  const [ordersCount, setOrdersCount] = useState(0);
  const [banner, setBanner] = useState("");

  useEffect(() => {
    if (localStorage.getItem("userType") !== "admin") navigate("/");
  }, []);

  useEffect(() => {
    fetchCounts();
  }, []);

  const fetchCounts = async () => {
    try {
      const users = await axios.get(
        "http://localhost:3000/api/users/fetch-users"
      );
      const products = await axios.get(
        "http://localhost:3000/api/products/fetch-products"
      );
      const orders = await axios.get(
        "http://localhost:3000/api/orders/fetch-orders"
      );

      setUserCount(users.data.length - 1);
      setProductCount(products.data.length);
      setOrdersCount(orders.data.length);
    } catch (err) {
      console.log(err);
    }
  };

  return (
    <div className="min-h-screen bg-linear-to-br from-slate-50 to-indigo-100 text-gray-900 p-6">
      <div className="max-w-7xl mx-auto space-y-12">

        {/* Header */}
        <header className="backdrop-blur-xl bg-white/60 p-6 rounded-2xl shadow border border-white/40">
          <h1 className="text-4xl font-extrabold text-slate-800">
            Admin Dashboard
          </h1>
          <p className="text-slate-600">Monitor platform activity in one view.</p>
        </header>

        {/* Stats Cards */}
        <section className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          <GlassCard
            icon={<HiUsers className="w-7 h-7 text-indigo-600" />}
            title="Users"
            count={userCount}
            onClick={() => navigate("/all-users")}
          />
          <GlassCard
            icon={<HiShoppingBag className="w-7 h-7 text-cyan-600" />}
            title="Products"
            count={productCount}
            onClick={() => navigate("/all-products")}
          />
          <GlassCard
            icon={<HiClipboardList className="w-7 h-7 text-teal-600" />}
            title="Orders"
            count={ordersCount}
            onClick={() => navigate("/all-orders")}
          />
          <GlassCard
            icon={<HiPlusCircle className="w-7 h-7 text-orange-500" />}
            title="Add Product"
            count=""
            onClick={() => navigate("/new-product")}
          />
        </section>

        {/* Summary */}
        <section className="grid grid-cols-1 md:grid-cols-3 gap-8">
          <SummaryCard
            label="Active Users"
            value={userCount}
            icon={<HiUsers className="w-9 h-9 opacity-90" />}
            gradient="from-indigo-500 to-blue-600"
          />
          <SummaryCard
            label="Total Products"
            value={productCount}
            icon={<HiShoppingBag className="w-9 h-9 opacity-90" />}
            gradient="from-cyan-500 to-teal-600"
          />
          <SummaryCard
            label="Total Orders"
            value={ordersCount}
            icon={<HiClipboardList className="w-9 h-9 opacity-90" />}
            gradient="from-purple-500 to-fuchsia-600"
          />
        </section>
      </div>
    </div>
  );
}

/* -------- COMPONENTS ---------- */

function GlassCard({ icon, title, count, onClick }) {
  return (
    <div
      onClick={onClick}
      className="backdrop-blur-lg bg-white/60 hover:bg-white/80 p-6 rounded-2xl shadow border border-white/40 cursor-pointer transition transform hover:-translate-y-1"
    >
      <div className="flex items-center justify-between">
        <div className="p-3 rounded-xl bg-white shadow">{icon}</div>
        <p className="text-sm font-medium text-slate-600">{title}</p>
      </div>

      <p className="mt-4 text-4xl font-extrabold text-slate-900">
        {count}
      </p>
    </div>
  );
}

function SummaryCard({ label, value, icon, gradient }) {
  return (
    <div
      className={`rounded-2xl p-6 text-white shadow-xl bg-linear-to-br ${gradient}`}
    >
      <div className="flex items-center justify-between">
        <div>
          <p className="text-sm opacity-90">{label}</p>
          <p className="text-3xl font-bold mt-1">{value}</p>
        </div>
        {icon}
      </div>
    </div>
  );
}
