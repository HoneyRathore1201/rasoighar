'use client';
import Link from 'next/link';
import { motion } from 'framer-motion';
import { GiCookingPot } from 'react-icons/gi';
import { FiSearch, FiBox, FiZap, FiArrowRight, FiBookOpen, FiCalendar } from 'react-icons/fi';

const features = [
  { icon: FiBookOpen, title: 'Recipe Box', desc: 'Store and organize your favorite recipes with rich details.' },
  { icon: FiSearch, title: 'Smart Matching', desc: 'Enter your ingredients and instantly discover what you can cook.' },
  { icon: FiBox, title: 'Fridge Tracker', desc: 'Keep track of your pantry. Never waste ingredients again.' },
  { icon: FiZap, title: 'Recipe Generator', desc: 'Generate creative recipes from the ingredients you have.' },
  { icon: FiCalendar, title: 'Meal Planner', desc: 'Plan your weekly meals on a visual calendar grid.' },
  { icon: GiCookingPot, title: 'Indian Cuisine', desc: '15+ authentic recipes, 85+ ingredients pre-loaded.' },
];

const dishes = [
  { name: 'Paneer Butter Masala', img: 'https://images.unsplash.com/photo-1631452180519-c014fe946bc7?w=300&h=200&fit=crop' },
  { name: 'Chicken Biryani', img: 'https://images.unsplash.com/photo-1563379091339-03b21ab4a4f8?w=300&h=200&fit=crop' },
  { name: 'Masala Dosa', img: 'https://images.unsplash.com/photo-1630383249896-424e482df921?w=300&h=200&fit=crop' },
  { name: 'Butter Chicken', img: 'https://images.unsplash.com/photo-1603894584373-5ac82b2ae398?w=300&h=200&fit=crop' },
];

export default function LandingPage() {
  return (
    <div className="min-h-screen bg-bg">
      {/* Navbar */}
      <nav className="flex items-center justify-between px-6 lg:px-16 py-4 max-w-7xl mx-auto">
        <div className="flex items-center gap-2.5">
          <div className="w-9 h-9 bg-accent rounded-xl flex items-center justify-center">
            <GiCookingPot className="text-white text-lg" />
          </div>
          <span className="text-xl font-bold text-text">RasoiGhar</span>
        </div>
        <div className="flex items-center gap-3">
          <Link href="/login" className="px-4 py-2 text-sm font-medium text-text-secondary hover:text-text transition-colors">Login</Link>
          <Link href="/signup" className="px-4 py-2.5 text-sm font-semibold bg-accent hover:bg-accent-hover text-white rounded-xl transition-colors">Get Started</Link>
        </div>
      </nav>

      {/* Hero */}
      <section className="px-6 lg:px-16 pt-16 pb-24 max-w-7xl mx-auto">
        <div className="grid lg:grid-cols-2 gap-16 items-center">
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5 }}>
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-accent/10 text-accent text-xs font-medium mb-6">
              <span className="w-1.5 h-1.5 rounded-full bg-accent" /> 15+ Indian Recipes Ready
            </div>
            <h1 className="text-4xl lg:text-6xl font-extrabold leading-[1.1] tracking-tight">
              <span className="text-text">Know what to cook</span><br />
              <span className="gradient-text">with what you have</span>
            </h1>
            <p className="mt-5 text-text-secondary max-w-md leading-relaxed">
              Add your ingredients, and RasoiGhar instantly finds recipes you can make. No more scrolling through cookbooks.
            </p>
            <div className="flex flex-wrap gap-3 mt-8">
              <Link href="/signup" className="inline-flex items-center gap-2 px-6 py-3 bg-accent hover:bg-accent-hover text-white font-semibold rounded-xl shadow-lg shadow-accent/20 transition-all hover:-translate-y-0.5">
                Start Cooking <FiArrowRight size={16} />
              </Link>
              <Link href="/login" className="inline-flex items-center gap-2 px-6 py-3 border border-border text-text-secondary font-medium rounded-xl hover:bg-bg-hover transition-all">
                Sign In
              </Link>
            </div>
          </motion.div>

          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5, delay: 0.15 }} className="hidden lg:block">
            <div className="grid grid-cols-2 gap-3">
              {dishes.map((d, i) => (
                <motion.div key={d.name} initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }}
                  transition={{ delay: 0.3 + i * 0.1 }}
                  className="relative rounded-2xl overflow-hidden group">
                  <img src={d.img} alt={d.name} className="w-full h-36 object-cover transition-transform duration-500 group-hover:scale-110" />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent" />
                  <p className="absolute bottom-2 left-3 text-white text-xs font-semibold">{d.name}</p>
                </motion.div>
              ))}
            </div>
          </motion.div>
        </div>
      </section>

      {/* Features */}
      <section className="px-6 lg:px-16 py-20 border-t border-border">
        <div className="max-w-7xl mx-auto">
          <motion.div initial={{ opacity: 0 }} whileInView={{ opacity: 1 }} viewport={{ once: true }} className="text-center mb-14">
            <h2 className="text-2xl lg:text-3xl font-extrabold text-text">Everything you need</h2>
            <p className="mt-2 text-text-muted text-sm">From recipe storage to smart cooking suggestions.</p>
          </motion.div>
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {features.map((f, i) => (
              <motion.div key={f.title} initial={{ opacity: 0, y: 12 }} whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }} transition={{ delay: i * 0.05 }}
                className="p-5 rounded-2xl border border-border bg-bg-card hover:border-accent/20 hover:bg-bg-elevated transition-all duration-300"
              >
                <div className="w-10 h-10 rounded-xl bg-accent/10 flex items-center justify-center mb-3">
                  <f.icon className="text-accent" size={18} />
                </div>
                <h3 className="font-semibold text-text text-sm">{f.title}</h3>
                <p className="text-xs text-text-muted mt-1.5 leading-relaxed">{f.desc}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="px-6 lg:px-16 py-20 max-w-7xl mx-auto text-center">
        <motion.div initial={{ opacity: 0, y: 15 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }}>
          <h2 className="text-2xl lg:text-3xl font-extrabold text-text">Ready to cook smarter?</h2>
          <p className="mt-2 text-text-muted text-sm">Join RasoiGhar for free.</p>
          <Link href="/signup" className="inline-flex items-center gap-2 mt-6 px-7 py-3.5 bg-accent hover:bg-accent-hover text-white font-semibold rounded-xl shadow-lg shadow-accent/20 transition-all hover:-translate-y-0.5">
            Create Account <FiArrowRight size={16} />
          </Link>
        </motion.div>
      </section>

      <footer className="border-t border-border px-6 py-5 text-center">
        <p className="text-xs text-text-muted">RasoiGhar &copy; {new Date().getFullYear()}</p>
      </footer>
    </div>
  );
}
