import { Link } from 'react-router-dom';
import {
  Truck, BarChart3, ShieldCheck, Wrench, DollarSign, Route,
  ArrowRight, CheckCircle, Star
} from 'lucide-react';

const features = [
  {
    icon: Truck,
    title: 'Fleet Tracking',
    desc: 'Monitor every vehicle — status, odometer, capacity, and region — in a single unified view.',
    color: 'bg-primary-50 text-primary-600',
  },
  {
    icon: ShieldCheck,
    title: 'Driver Compliance',
    desc: 'Track license expiry dates, safety scores, and driver availability across your entire team.',
    color: 'bg-green-50 text-green-600',
  },
  {
    icon: Route,
    title: 'Trip Dispatch',
    desc: 'Create trips, assign verified drivers to available vehicles, and track status from Draft to Complete.',
    color: 'bg-blue-50 text-blue-600',
  },
  {
    icon: Wrench,
    title: 'Maintenance Logs',
    desc: 'Log service records, track costs, and keep vehicles out of circulation while they\'re in the shop.',
    color: 'bg-amber-50 text-amber-600',
  },
  {
    icon: DollarSign,
    title: 'Expense Tracking',
    desc: 'Record fuel fills, tolls, and driver allowances linked to trips and vehicles for full cost visibility.',
    color: 'bg-purple-50 text-purple-600',
  },
  {
    icon: BarChart3,
    title: 'Analytics & Reports',
    desc: 'Fuel efficiency, fleet utilization, and operational costs — all filterable and exportable to CSV.',
    color: 'bg-rose-50 text-rose-600',
  },
];

const techStack = ['React 19', 'Vite', 'Tailwind CSS', 'Zustand', 'Axios', 'Chart.js', 'Spring Boot', 'MySQL'];

const stats = [
  { label: 'Vehicles Managed', value: '10,000+' },
  { label: 'Trips Dispatched', value: '2M+' },
  { label: 'Uptime SLA', value: '99.9%' },
  { label: 'Avg. Fuel Saved', value: '18%' },
];

export default function LandingPage() {
  return (
    <div className="min-h-screen bg-white flex flex-col">
      {/* Nav */}
      <nav className="sticky top-0 z-40 bg-white/80 backdrop-blur border-b border-neutral-100">
        <div className="max-w-6xl mx-auto px-4 lg:px-6 h-14 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 bg-primary-600 rounded-lg flex items-center justify-center">
              <Truck className="w-4 h-4 text-white" />
            </div>
            <span className="font-bold text-neutral-900 tracking-tight">TransitOps</span>
          </div>
          <Link
            to="/login"
            className="flex items-center gap-1.5 text-sm font-medium text-white bg-primary-600 hover:bg-primary-700 px-4 py-2 rounded-lg transition-colors"
          >
            Sign in
            <ArrowRight className="w-3.5 h-3.5" />
          </Link>
        </div>
      </nav>

      {/* Hero */}
      <section className="relative overflow-hidden bg-gradient-to-br from-neutral-950 via-primary-950 to-neutral-900 text-white">
        <div className="absolute inset-0 pointer-events-none">
          <div className="absolute top-0 left-1/4 w-[400px] h-[400px] bg-primary-600/20 rounded-full blur-3xl" />
          <div className="absolute bottom-0 right-1/4 w-[300px] h-[300px] bg-indigo-600/20 rounded-full blur-3xl" />
        </div>
        <div className="relative max-w-6xl mx-auto px-4 lg:px-6 py-24 lg:py-32 text-center">
          <div className="inline-flex items-center gap-2 bg-white/10 border border-white/20 rounded-full px-4 py-1.5 text-xs font-medium text-neutral-300 mb-6">
            <Star className="w-3 h-3 text-amber-400" />
            Built for real-world Indian fleet operations
          </div>
          <h1 className="text-4xl lg:text-6xl font-extrabold tracking-tight mb-6 leading-tight">
            Smart transport ops,<br />
            <span className="text-primary-400">from dispatch to delivery.</span>
          </h1>
          <p className="text-lg text-neutral-300 max-w-2xl mx-auto mb-10 leading-relaxed">
            TransitOps is a role-based fleet management platform that brings vehicles, drivers, trips,
            maintenance, and expenses into one clean, operational dashboard.
          </p>
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
            <Link
              to="/login"
              className="inline-flex items-center gap-2 bg-primary-600 hover:bg-primary-500 text-white font-semibold px-8 py-3.5 rounded-xl transition-all hover:shadow-lg hover:shadow-primary-600/25 text-sm"
            >
              Get started
              <ArrowRight className="w-4 h-4" />
            </Link>
            <a
              href="#features"
              className="inline-flex items-center gap-2 text-neutral-300 hover:text-white font-medium px-6 py-3.5 text-sm border border-white/10 rounded-xl hover:border-white/30 transition-colors"
            >
              See what it does
            </a>
          </div>
        </div>
      </section>

      {/* Stats strip */}
      <section className="bg-neutral-50 border-y border-neutral-200">
        <div className="max-w-6xl mx-auto px-4 lg:px-6 py-10">
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-8">
            {stats.map((s) => (
              <div key={s.label} className="text-center">
                <p className="text-3xl font-extrabold text-primary-600 mb-1">{s.value}</p>
                <p className="text-sm text-neutral-500">{s.label}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* About */}
      <section className="max-w-6xl mx-auto px-4 lg:px-6 py-20">
        <div className="grid lg:grid-cols-2 gap-12 items-center">
          <div>
            <h2 className="text-3xl font-bold text-neutral-900 mb-5 leading-tight">
              Fleet operations have too many moving parts. We keep them in sync.
            </h2>
            <p className="text-neutral-500 leading-relaxed mb-6">
              Managing a transport fleet means juggling dozens of vehicles, license expiry dates, cargo weights,
              fuel costs, maintenance windows, and trip statuses — often across multiple cities.
              Spreadsheets break down. WhatsApp groups lose track. Things fall through the cracks.
            </p>
            <p className="text-neutral-500 leading-relaxed mb-8">
              TransitOps replaces the chaos with a structured, role-based platform where Fleet Managers,
              Drivers, Safety Officers, and Financial Analysts each see exactly what they need — and nothing they don't.
            </p>
            <ul className="space-y-3">
              {['Role-based access — 4 distinct dashboards', 'Mock data mode for instant demos', 'API-ready for Spring Boot backend'].map((point) => (
                <li key={point} className="flex items-center gap-2.5 text-sm text-neutral-600">
                  <CheckCircle className="w-4 h-4 text-green-500 flex-shrink-0" />
                  {point}
                </li>
              ))}
            </ul>
          </div>
          {/* Visual mockup placeholder */}
          <div className="bg-gradient-to-br from-primary-600 to-indigo-600 rounded-2xl p-6 shadow-xl">
            <div className="bg-white/10 rounded-xl p-4 space-y-3">
              {[
                { label: 'Total Vehicles', val: '15', color: 'bg-blue-400' },
                { label: 'Active Trips', val: '3', color: 'bg-green-400' },
                { label: 'In Maintenance', val: '2', color: 'bg-amber-400' },
                { label: 'Fleet Utilization', val: '67%', color: 'bg-purple-400' },
              ].map((item) => (
                <div key={item.label} className="flex items-center justify-between bg-white/10 rounded-lg px-4 py-3">
                  <div className="flex items-center gap-2">
                    <div className={`w-2 h-2 rounded-full ${item.color}`} />
                    <span className="text-sm text-white/80">{item.label}</span>
                  </div>
                  <span className="font-bold text-white">{item.val}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Features */}
      <section id="features" className="bg-neutral-50 py-20">
        <div className="max-w-6xl mx-auto px-4 lg:px-6">
          <div className="text-center mb-14">
            <h2 className="text-3xl font-bold text-neutral-900 mb-3">Everything you need to run your fleet</h2>
            <p className="text-neutral-500 max-w-xl mx-auto text-sm">
              Six core modules covering the full operational lifecycle — from vehicle registration to financial reporting.
            </p>
          </div>
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {features.map((f) => {
              const Icon = f.icon;
              return (
                <div key={f.title} className="bg-white rounded-xl p-6 border border-neutral-200 hover:border-primary-200 hover:shadow-md transition-all">
                  <div className={`w-10 h-10 rounded-xl flex items-center justify-center mb-4 ${f.color}`}>
                    <Icon className="w-5 h-5" />
                  </div>
                  <h3 className="font-semibold text-neutral-900 mb-2">{f.title}</h3>
                  <p className="text-sm text-neutral-500 leading-relaxed">{f.desc}</p>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* Tech stack */}
      <section className="max-w-6xl mx-auto px-4 lg:px-6 py-16 text-center">
        <p className="text-xs font-semibold text-neutral-400 uppercase tracking-widest mb-5">Built with</p>
        <div className="flex flex-wrap justify-center gap-2">
          {techStack.map((t) => (
            <span key={t} className="px-3 py-1.5 bg-neutral-100 text-neutral-600 rounded-full text-xs font-medium border border-neutral-200">
              {t}
            </span>
          ))}
        </div>
      </section>

      {/* CTA */}
      <section className="bg-gradient-to-br from-primary-600 to-indigo-700 text-white py-20 text-center">
        <div className="max-w-2xl mx-auto px-4">
          <h2 className="text-3xl font-bold mb-4">Ready to manage your fleet?</h2>
          <p className="text-primary-100 mb-8 text-sm">Sign in and explore all four role dashboards instantly — no setup required.</p>
          <Link
            to="/login"
            className="inline-flex items-center gap-2 bg-white text-primary-700 font-semibold px-8 py-3.5 rounded-xl hover:bg-neutral-100 transition-colors text-sm"
          >
            Sign in to TransitOps
            <ArrowRight className="w-4 h-4" />
          </Link>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-neutral-200 py-8 text-center text-xs text-neutral-400">
        <div className="flex items-center justify-center gap-2 mb-2">
          <div className="w-5 h-5 bg-primary-600 rounded flex items-center justify-center">
            <Truck className="w-2.5 h-2.5 text-white" />
          </div>
          <span className="font-semibold text-neutral-600">TransitOps</span>
        </div>
        <p>Internal fleet management platform. For authorized personnel only.</p>
      </footer>
    </div>
  );
}
