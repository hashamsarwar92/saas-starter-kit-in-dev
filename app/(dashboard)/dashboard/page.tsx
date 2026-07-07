"use client";

import {
  Server,
  Globe,
  Database,
  Activity,
  CreditCard,
  ShieldCheck,
  TrendingUp,
} from "lucide-react";


export default function OverviewPage() {

  return (
    <div className="space-y-6">

      {/* <SubscriptionStatus /> */}

      {/* Provisioning Notice */}
      <div className="bg-yellow-50 border border-yellow-200 text-yellow-800 rounded-xl p-4 text-sm">
        <p className="font-semibold">
          Platform Provisioning in Progress
        </p>
        <p>
          It may take up to <strong>24 to 48 hours</strong> to enable all system resources.
        </p>
      </div>

      {/* Header */}
      <div>
        <h1 className="text-2xl font-bold text-gray-900">
          Platform Overview
        </h1>
        <p className="text-sm text-gray-500">
          Monitor your infrastructure, usage, and deployments
        </p>
      </div>

      {/* Welcome (safe fallback user) */}
      <div className="bg-gradient-to-r from-gray-100 to-gray-200 text-gray-700 rounded-xl p-6">
        <h2 className="text-xl font-semibold">
          Welcome 👋
        </h2>

        <p className="text-sm text-gray-600 mt-1">
          Your workspace is being prepared. Metrics will appear once provisioning is complete.
        </p>

        <button
          disabled
          className="mt-4 bg-gray-300 text-white px-4 py-2 rounded-lg text-sm cursor-not-allowed"
        >
          New Deployment
        </button>
      </div>

      {/* Stats (empty state) */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">

        <div className="bg-white border rounded-xl p-4 text-gray-400">
          <div className="flex items-center gap-2 text-sm">
            <Server size={16} />
            Deployments
          </div>
          <p className="text-2xl font-semibold mt-2">--</p>
          <p className="text-xs mt-1">Not available</p>
        </div>

        <div className="bg-white border rounded-xl p-4 text-gray-400">
          <div className="flex items-center gap-2 text-sm">
            <Database size={16} />
            Database Ops
          </div>
          <p className="text-2xl font-semibold mt-2">--</p>
          <p className="text-xs mt-1">Pending setup</p>
        </div>

        <div className="bg-white border rounded-xl p-4 text-gray-400">
          <div className="flex items-center gap-2 text-sm">
            <Globe size={16} />
            Domains
          </div>
          <p className="text-2xl font-semibold mt-2">--</p>
          <p className="text-xs mt-1">Not configured</p>
        </div>

        <div className="bg-white border rounded-xl p-4 text-gray-400">
          <div className="flex items-center gap-2 text-sm">
            <CreditCard size={16} />
            Plan
          </div>
          <p className="text-2xl font-semibold mt-2">--</p>
          <p className="text-xs mt-1">Loading billing info</p>
        </div>

      </div>

      {/* Middle section */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">

        {/* Activity */}
        <div className="lg:col-span-2 bg-white border rounded-xl p-5 shadow-sm">

          <div className="flex items-center gap-2 font-medium text-gray-900 mb-4">
            <Activity size={16} />
            System Activity
          </div>

          <div className="space-y-3 text-sm text-gray-400">
            <div className="flex justify-between">
              <span>Edge network latency</span>
              <span>--</span>
            </div>

            <div className="flex justify-between">
              <span>API success rate</span>
              <span>--</span>
            </div>

            <div className="flex justify-between">
              <span>Database uptime</span>
              <span>--</span>
            </div>

            <div className="flex justify-between">
              <span>Active sessions</span>
              <span>--</span>
            </div>
          </div>

          {/* Placeholder chart */}
          <div className="mt-6 h-40 bg-gray-50 rounded-lg flex items-center justify-center text-gray-400">
            System metrics will appear once services are active
          </div>
        </div>

        {/* Right panel */}
        <div className="space-y-4">

          {/* Security */}
          <div className="bg-white border rounded-xl p-4 shadow-sm">
            <div className="flex items-center gap-2 text-gray-600 text-sm">
              <ShieldCheck size={16} />
              Security Status
            </div>

            <p className="text-gray-400 font-semibold mt-2">
              Pending initialization
            </p>

            <p className="text-xs text-gray-500 mt-1">
              Security systems will activate after provisioning
            </p>
          </div>

          {/* Quick actions */}
          <div className="bg-white border rounded-xl p-4 shadow-sm text-gray-400">
            <p className="font-medium mb-3">Quick Actions</p>

            <div className="space-y-2 text-sm">
              <button className="w-full text-left cursor-not-allowed">
                + New Deployment
              </button>

              <button className="w-full text-left cursor-not-allowed">
                Connect Domain
              </button>

              <button className="w-full text-left cursor-not-allowed">
                View Logs
              </button>
            </div>
          </div>

          {/* Upgrade */}
          <div className="bg-blue-50 border border-blue-100 rounded-xl p-4 text-gray-500">

            <div className="flex items-center gap-2 font-medium">
              <TrendingUp size={16} />
              Upgrade Plan
            </div>

            <p className="text-sm mt-2">
              Billing and upgrade options will be available once your workspace is active
            </p>

            <button
              disabled
              className="mt-3 bg-gray-300 text-white w-full py-2 rounded-lg text-sm cursor-not-allowed"
            >
              Upgrade
            </button>
          </div>

        </div>
      </div>
    </div>
  );
}