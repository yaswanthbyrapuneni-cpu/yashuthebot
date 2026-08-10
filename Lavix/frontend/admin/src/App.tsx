import { 
  Home as HomeIcon, 
  BarChart2, 
  Upload, 
  Settings, 
  LogOut,
  Activity,
  Plus,
  Trash2,
  CheckCircle,
  AlertCircle,
  RefreshCw,
  User,
  Clock,
  Shirt,
  Tag,
  Palette,
  FileText,
  Shield
} from "lucide-react";
import { useState, useEffect } from "react";
import { SecuritySettings } from "./components/SecuritySettings";
import { 
  AreaChart, 
  Area, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
  BarChart,
  Bar,
  Legend
} from "recharts";

import imgAvatarUser from "./imports/AdminSecurity-1/6c1fe88a3b9e8dfddf4a065581b04df49638ca9c.png";

const API_BASE_URL = "http://localhost:5000";

interface Garment {
  id: string;
  name: string;
  color: string;
  category: string;
  imageUrl: string;
}

interface Ticket {
  id: string;
  subject: string;
  category: string;
  priority: string;
  description: string;
  status: string;
  createdAt: string;
}

interface Analytics {
  summary: {
    avg_rating: number;
    total_feedback: number;
    total_skipped: number;
    completion_rate: number;
    emoji_counts: Record<string, number>;
    total_sessions: number;
    footfall: number;
    try_on_rate: number;
  };
  trends: {
    daily: any[];
    weekly: any[];
    monthly: any[];
  };
  recent: any[];
  category_distribution: any[];
  most_tried_products: any[];
}

interface Diagnostics {
  status: string;
  serverTime: string;
  flaskPort: number;
  supabaseConnected: boolean;
  pythonVersion: string;
  garmentsCount: number;
  services: Array<{ name: string; status: string; details: string }>;
}

export default function App() {
  const [currentTab, setCurrentTab] = useState<"home" | "analytics" | "upload" | "tickets" | "diagnostics" | "security">("home");
  const [isAuthenticated, setIsAuthenticated] = useState<boolean>(() => sessionStorage.getItem("admin_auth") === "true");
  const [loggedInUser, setLoggedInUser] = useState<string>(() => sessionStorage.getItem("admin_user") || "Admin");
  const [isSignupMode, setIsSignupMode] = useState(false);
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [loginError, setLoginError] = useState("");
  const [successMessage, setSuccessMessage] = useState("");

  const handleSubmitAuth = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoginError("");
    setSuccessMessage("");

    const endpoint = isSignupMode ? "/api/admin/signup" : "/api/admin/login";
    try {
      const response = await fetch(`${API_BASE_URL}${endpoint}`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ username, password })
      });
      const data = await response.json();
      
      if (response.ok && data.success) {
        if (isSignupMode) {
          setSuccessMessage("Registered successfully! You can now log in.");
          setIsSignupMode(false);
          setPassword("");
        } else {
          sessionStorage.setItem("admin_auth", "true");
          sessionStorage.setItem("admin_user", username);
          setLoggedInUser(username);
          setIsAuthenticated(true);
          setLoginError("");
        }
      } else {
        setLoginError(data.error || "Authentication failed.");
      }
    } catch (err: any) {
      setLoginError(err.message || "Failed to reach server.");
    }
  };

  const handleLogout = () => {
    sessionStorage.removeItem("admin_auth");
    sessionStorage.removeItem("admin_user");
    setIsAuthenticated(false);
    setLoggedInUser("Admin");
    setUsername("");
    setPassword("");
  };

  if (!isAuthenticated) {
    return (
      <div className="min-h-screen bg-slate-900 flex items-center justify-center p-4 font-sans text-slate-100 w-full">
        <div className="w-full max-w-[440px] bg-slate-800 border border-slate-700 p-8 rounded-2xl shadow-2xl flex flex-col gap-6">
          <div className="text-center flex flex-col gap-2">
            <div className="w-12 h-12 rounded-xl bg-indigo-600 flex items-center justify-center mx-auto text-white font-bold text-xl shadow-md">
              V
            </div>
            <h1 className="text-2xl font-bold tracking-tight text-white mt-2">Vastra Admin Console</h1>
            <p className="text-sm text-slate-400">
              {isSignupMode ? "Create Admin Account" : "Sign in to manage kiosk settings"}
            </p>
          </div>

          {loginError && (
            <div className="bg-rose-500/10 border border-rose-500/20 text-rose-300 p-3.5 rounded-lg text-xs font-semibold flex items-center gap-2">
              <AlertCircle className="w-4 h-4 text-rose-400 shrink-0" />
              <span>{loginError}</span>
            </div>
          )}

          {successMessage && (
            <div className="bg-emerald-500/10 border border-emerald-500/20 text-emerald-300 p-3.5 rounded-lg text-xs font-semibold flex items-center gap-2">
              <CheckCircle className="w-4 h-4 text-emerald-400 shrink-0" />
              <span>{successMessage}</span>
            </div>
          )}

          <form onSubmit={handleSubmitAuth} className="flex flex-col gap-4 text-xs font-medium">
            <div className="flex flex-col gap-1.5">
              <label className="text-slate-300">Username</label>
              <input
                type="text"
                placeholder="Enter username"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                className="w-full px-3 py-2 bg-slate-700/50 border border-slate-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 text-sm text-white placeholder-slate-500"
                required
              />
            </div>

            <div className="flex flex-col gap-1.5">
              <label className="text-slate-300">Password</label>
              <input
                type="password"
                placeholder="••••••••"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full px-3 py-2 bg-slate-700/50 border border-slate-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 text-sm text-white placeholder-slate-500"
                required
              />
            </div>

            <button
              type="submit"
              className="w-full bg-indigo-600 hover:bg-indigo-700 text-white font-bold py-2.5 rounded-lg text-sm transition-all shadow-md shadow-indigo-600/10 active:scale-[0.98] mt-2 cursor-pointer"
            >
              {isSignupMode ? "Register Account" : "Sign In"}
            </button>
          </form>

          <div className="text-center pt-2">
            <button
              onClick={() => {
                setIsSignupMode(!isSignupMode);
                setLoginError("");
                setSuccessMessage("");
              }}
              className="text-indigo-400 hover:text-indigo-300 text-xs font-semibold transition-colors bg-transparent border-0 cursor-pointer outline-none"
            >
              {isSignupMode ? "Already have an account? Sign In" : "Don't have an account? Sign Up"}
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-[#f8fafc] flex items-start relative size-full min-h-screen font-sans overflow-hidden text-slate-800">
      <Sidebar currentTab={currentTab} setCurrentTab={setCurrentTab} onLogout={handleLogout} loggedInUser={loggedInUser} />
      <div className="flex-1 h-screen overflow-y-auto p-[16px] md:p-[24px]">
        <div className="max-w-[1200px] mx-auto w-full">
          {currentTab === "home" && <DashboardHome />}
          {currentTab === "analytics" && <DashboardAnalytics />}
          {currentTab === "upload" && <UploadGarments />}
          {currentTab === "tickets" && <SupportTickets />}
          {currentTab === "diagnostics" && <SystemDiagnostics />}
          {currentTab === "security" && <SecuritySettings />}
        </div>
      </div>
    </div>
  );
}

function Sidebar({ 
  currentTab, 
  setCurrentTab,
  onLogout,
  loggedInUser
}: { 
  currentTab: string; 
  setCurrentTab: (tab: any) => void;
  onLogout: () => void;
  loggedInUser: string;
}) {
  return (
    <div className="bg-white h-screen sticky top-0 flex flex-col justify-between shrink-0 w-[245px] border-r border-slate-200/80 shadow-[1px_0_10px_rgba(0,0,0,0.02)]">
      <div className="flex flex-col gap-[28px] pt-[32px] w-full">
        {/* Logo */}
        <div className="pl-[24px] pr-[12px] w-full flex items-center gap-2">
          <div className="w-8 h-8 rounded-lg bg-indigo-600 flex items-center justify-center text-white font-bold text-lg shadow-md shadow-indigo-600/20">V</div>
          <span className="font-bold text-[17px] text-slate-900 tracking-tight">Vastra Admin AI</span>
        </div>

        {/* Navigation */}
        <div className="flex flex-col gap-[4px] px-[16px] w-full">
          <NavItem icon={<HomeIcon className="w-4 h-4" />} label="Dashboard" active={currentTab === "home"} onClick={() => setCurrentTab("home")} />
          <NavItem icon={<BarChart2 className="w-4 h-4" />} label="Analytics" active={currentTab === "analytics"} onClick={() => setCurrentTab("analytics")} />
          <NavItem icon={<Upload className="w-4 h-4" />} label="Upload Garments" active={currentTab === "upload"} onClick={() => setCurrentTab("upload")} />
          <NavItem icon={<FileText className="w-4 h-4" />} label="Support Tickets" active={currentTab === "tickets"} onClick={() => setCurrentTab("tickets")} />
          <NavItem icon={<Activity className="w-4 h-4" />} label="Diagnostics" active={currentTab === "diagnostics"} onClick={() => setCurrentTab("diagnostics")} />
          <NavItem icon={<Shield className="w-4 h-4" />} label="Security Settings" active={currentTab === "security"} onClick={() => setCurrentTab("security")} />
        </div>
      </div>

      <div className="flex flex-col gap-[24px] pb-[32px] px-[16px] w-full">
        {/* User Account */}
        <div className="flex items-center justify-between pl-[8px] pt-[24px] border-t border-slate-100 w-full">
          <span className="font-semibold text-slate-800 text-[13px] truncate flex-1">
            {loggedInUser.charAt(0).toUpperCase() + loggedInUser.slice(1)}
          </span>
          <button onClick={onLogout} className="p-2 text-slate-400 hover:text-rose-600 hover:bg-rose-50 rounded-lg transition-colors shrink-0 cursor-pointer" title="Logout">
            <LogOut className="w-4 h-4" />
          </button>
        </div>
      </div>
    </div>
  );
}

function NavItem({ 
  icon, 
  label, 
  active = false, 
  onClick 
}: { 
  icon: React.ReactNode; 
  label: string; 
  active?: boolean; 
  onClick: () => void;
}) {
  return (
    <button 
      onClick={onClick}
      className={`flex items-center gap-[12px] px-[14px] py-[10px] rounded-[8px] w-full transition-all duration-250 relative ${
        active 
          ? 'bg-indigo-550/10 text-indigo-700 font-semibold bg-indigo-50/50' 
          : 'hover:bg-slate-50 text-slate-600 hover:text-slate-900 font-medium'
      }`}
    >
      <div className={`shrink-0 ${active ? 'text-indigo-600' : 'text-slate-400'}`}>{icon}</div>
      <span className="text-[14px] flex-1 text-left">{label}</span>
      {active && <div className="absolute right-0 top-1/2 -translate-y-1/2 w-1.5 h-6 bg-indigo-600 rounded-l-[4px]" />}
    </button>
  );
}

// 1. Dashboard Home Tab
function DashboardHome() {
  const [analytics, setAnalytics] = useState<Analytics | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch(`${API_BASE_URL}/api/feedback/analytics`)
      .then(res => res.json())
      .then(data => {
        if (data.success) {
          setAnalytics(data);
        }
        setLoading(false);
      })
      .catch(err => {
        console.error("Error loading analytics:", err);
        setLoading(false);
      });
  }, []);

  if (loading) return <LoadingSpinner />;

  return (
    <div className="flex flex-col gap-6 animate-fadeIn">
      <div>
        <h1 className="font-bold text-slate-950 text-[26px]">Dashboard Overview</h1>
        <p className="text-slate-500 text-[14px]">Real-time business performance & try-on activity</p>
      </div>

      {/* Metrics Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <MetricCard title="Average CSAT" value={`${analytics?.summary.avg_rating || 4.8} / 5`} subtitle="From submitted rating" color="border-l-teal-500" />
        <MetricCard title="Total Try-On Sessions" value={analytics?.summary.total_sessions || 0} subtitle="Across all devices" color="border-l-indigo-500" />
        <MetricCard title="Feedback Submitted" value={analytics?.summary.total_feedback || 0} subtitle={`${analytics?.summary.completion_rate || 0}% Completion Rate`} color="border-l-pink-500" />
        <MetricCard title="Mall Footfall Context" value={analytics?.summary.footfall || 0} subtitle={`${analytics?.summary.try_on_rate || 0}% Try-on Conversion`} color="border-l-amber-500" />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Recent Activity Table */}
        <div className="lg:col-span-2 bg-white border border-slate-200/80 rounded-xl p-5 shadow-sm">
          <h3 className="font-bold text-[16px] text-slate-900 mb-4">Recent Try-On Feedbacks</h3>
          <div className="overflow-x-auto">
            <table className="w-full text-left text-[13px]">
              <thead>
                <tr className="border-b border-slate-100 text-slate-400 font-semibold">
                  <th className="py-2.5">Time</th>
                  <th className="py-2.5">Garment</th>
                  <th className="py-2.5">Gender</th>
                  <th className="py-2.5">Score</th>
                  <th className="py-2.5">Feedback Status</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-50">
                {analytics?.recent && analytics.recent.length > 0 ? (
                  analytics.recent.map((f, i) => (
                    <tr key={i} className="hover:bg-slate-50/50 transition-colors">
                      <td className="py-3 text-slate-500">{new Date(f.created_at).toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'})}</td>
                      <td className="py-3 font-semibold text-slate-800">{f.selected_garment}</td>
                      <td className="py-3 text-slate-600">{f.gender}</td>
                      <td className="py-3">
                        <span className="text-[15px] mr-1">{f.feedback_emoji || "—"}</span>
                        {f.feedback_score ? `(${f.feedback_score}/5)` : ""}
                      </td>
                      <td className="py-3">
                        <span className={`px-2 py-0.5 rounded-full text-[11px] font-semibold ${
                          f.feedback_status === 'submitted' ? 'bg-emerald-50 text-emerald-700' : 'bg-slate-100 text-slate-600'
                        }`}>
                          {f.feedback_status}
                        </span>
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan={5} className="py-8 text-center text-slate-400">No try-ons recorded yet.</td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>

        {/* Top Performing Garments */}
        <div className="bg-white border border-slate-200/80 rounded-xl p-5 shadow-sm">
          <h3 className="font-bold text-[16px] text-slate-900 mb-4">Top Tried Products</h3>
          <div className="flex flex-col gap-4">
            {analytics?.most_tried_products && analytics.most_tried_products.length > 0 ? (
              analytics.most_tried_products.map((item, idx) => (
                <div key={idx} className="flex items-center justify-between border-b border-slate-100 pb-3 last:border-none last:pb-0">
                  <div className="flex flex-col">
                    <span className="font-semibold text-slate-800 text-[13px]">{item.name}</span>
                    <span className="text-[11px] text-slate-400">{item.category}</span>
                  </div>
                  <div className="flex flex-col items-end">
                    <span className="text-[13px] font-bold text-indigo-600">{item.tryOns} Try-Ons</span>
                    <span className="text-[11px] text-slate-500">⭐ {item.rating}</span>
                  </div>
                </div>
              ))
            ) : (
              <p className="text-center text-slate-400 text-[13px] py-8">No data available.</p>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

// 2. Dashboard Analytics Tab
function DashboardAnalytics() {
  const [analytics, setAnalytics] = useState<Analytics | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch(`${API_BASE_URL}/api/feedback/analytics`)
      .then(res => res.json())
      .then(data => {
        if (data.success) {
          setAnalytics(data);
        }
        setLoading(false);
      })
      .catch(err => {
        console.error("Error loading analytics:", err);
        setLoading(false);
      });
  }, []);

  if (loading) return <LoadingSpinner />;

  return (
    <div className="flex flex-col gap-6 animate-fadeIn">
      <div>
        <h1 className="font-bold text-slate-950 text-[26px]">Analytics & Reports</h1>
        <p className="text-slate-500 text-[14px]">Deep dive try-on trends and user satisfaction insights</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Trend Area Chart */}
        <div className="lg:col-span-2 bg-white border border-slate-200/80 rounded-xl p-5 shadow-sm">
          <h3 className="font-bold text-[15px] text-slate-900 mb-4">Daily Try-on Volume & Visitors</h3>
          <div className="h-[280px] w-full">
            {analytics?.trends.daily && analytics.trends.daily.length > 0 ? (
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart data={analytics.trends.daily}>
                  <defs>
                    <linearGradient id="colorTryOns" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#6366f1" stopOpacity={0.2}/>
                      <stop offset="95%" stopColor="#6366f1" stopOpacity={0}/>
                    </linearGradient>
                  </defs>
                  <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" />
                  <XAxis dataKey="name" stroke="#94a3b8" fontSize={11} />
                  <YAxis stroke="#94a3b8" fontSize={11} />
                  <Tooltip contentStyle={{ fontSize: 12, borderRadius: 8 }} />
                  <Legend wrapperStyle={{ fontSize: 12 }} />
                  <Area name="Try-Ons" type="monotone" dataKey="tryOns" stroke="#6366f1" strokeWidth={2} fillOpacity={1} fill="url(#colorTryOns)" />
                  <Area name="Total Visitors" type="monotone" dataKey="visitors" stroke="#94a3b8" strokeWidth={1} fillOpacity={0} />
                </AreaChart>
              </ResponsiveContainer>
            ) : (
              <p className="text-center text-slate-400 pt-[100px]">Not enough data to plot trend.</p>
            )}
          </div>
        </div>

        {/* Category distribution */}
        <div className="bg-white border border-slate-200/80 rounded-xl p-5 shadow-sm flex flex-col justify-between">
          <h3 className="font-bold text-[15px] text-slate-900 mb-4">Category Preference Share</h3>
          <div className="h-[200px] w-full flex justify-center items-center relative">
            {analytics?.category_distribution && analytics.category_distribution.length > 0 ? (
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={analytics.category_distribution}
                    cx="50%"
                    cy="50%"
                    innerRadius={60}
                    outerRadius={80}
                    paddingAngle={4}
                    dataKey="value"
                  >
                    {analytics.category_distribution.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={entry.color || "#6366f1"} />
                    ))}
                  </Pie>
                  <Tooltip formatter={(value) => `${value}%`} />
                </PieChart>
              </ResponsiveContainer>
            ) : (
              <p className="text-slate-400">No preference data.</p>
            )}
            <div className="absolute flex flex-col items-center">
              <span className="text-[12px] text-slate-400 uppercase tracking-wider">Garments</span>
              <span className="text-[20px] font-bold text-slate-800">Popularity</span>
            </div>
          </div>
          
          <div className="grid grid-cols-2 gap-2 mt-4 text-[12px]">
            {analytics?.category_distribution.map((entry, idx) => (
              <div key={idx} className="flex items-center gap-1.5">
                <span className="w-2.5 h-2.5 rounded-full" style={{ backgroundColor: entry.color }} />
                <span className="text-slate-600 truncate">{entry.name}: {entry.value}%</span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

// 3. Upload & Manage Garments Tab
function UploadGarments() {
  const [garments, setGarments] = useState<Garment[]>([]);
  const [loading, setLoading] = useState(true);
  
  // Form state
  const [name, setName] = useState("");
  const [color, setColor] = useState("Custom");
  const [category, setCategory] = useState("Sarees");
  const [gender, setGender] = useState("Women");
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [imageBase64, setImageBase64] = useState<string | null>(null);
  
  const [uploading, setUploading] = useState(false);
  const [message, setMessage] = useState<{ type: 'success' | 'error', text: string } | null>(null);

  const fetchGarments = () => {
    setLoading(true);
    fetch(`${API_BASE_URL}/garments`)
      .then(res => res.json())
      .then(data => {
        setGarments(data);
        setLoading(false);
      })
      .catch(err => {
        console.error("Error loading garments:", err);
        setLoading(false);
      });
  };

  useEffect(() => {
    fetchGarments();
  }, []);

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      setImageFile(file);
      
      const reader = new FileReader();
      reader.onloadend = () => {
        setImageBase64(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleUploadSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim()) {
      setMessage({ type: 'error', text: "Please enter a garment name." });
      return;
    }
    if (!imageBase64) {
      setMessage({ type: 'error', text: "Please upload or snap an image of the garment." });
      return;
    }

    setUploading(true);
    setMessage(null);

    try {
      const response = await fetch(`${API_BASE_URL}/garments`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          name: name.trim(),
          color,
          category,
          gender,
          image: imageBase64
        })
      });
      const resData = await response.json();
      if (resData.success) {
        setMessage({ type: 'success', text: "Garment uploaded successfully!" });
        setName("");
        setImageFile(null);
        setImageBase64(null);
        fetchGarments(); // Refresh list
      } else {
        setMessage({ type: 'error', text: resData.error || "Failed to upload garment." });
      }
    } catch (err: any) {
      setMessage({ type: 'error', text: err.message || "Network error occurred." });
    } finally {
      setUploading(false);
    }
  };

  const handleDeleteGarment = async (id: string) => {
    if (!confirm("Are you sure you want to delete this garment?")) return;
    try {
      const response = await fetch(`${API_BASE_URL}/garments/${id}`, {
        method: 'DELETE'
      });
      const data = await response.json();
      if (data.success) {
        fetchGarments(); // Refresh list
      } else {
        alert("Failed to delete garment: " + data.error);
      }
    } catch (err) {
      console.error(err);
      alert("Error deleting garment.");
    }
  };

  return (
    <div className="flex flex-col gap-6 animate-fadeIn">
      <div>
        <h1 className="font-bold text-slate-950 text-[26px]">Catalogue Management</h1>
        <p className="text-slate-500 text-[14px]">Add, preview, or remove items from the Virtual Try-On catalog</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        
        {/* Upload Form */}
        <div className="bg-white border border-slate-200/80 rounded-xl p-5 shadow-sm h-fit">
          <h3 className="font-bold text-[16px] text-slate-900 mb-4 flex items-center gap-2">
            <Plus className="w-5 h-5 text-indigo-600" />
            Add New Garment
          </h3>

          {message && (
            <div className={`p-3 rounded-lg mb-4 flex items-start gap-2 text-[13px] ${
              message.type === 'success' ? 'bg-emerald-50 text-emerald-700 border border-emerald-100' : 'bg-rose-50 text-rose-700 border border-rose-100'
            }`}>
              {message.type === 'success' ? <CheckCircle className="w-4 h-4 mt-0.5 shrink-0" /> : <AlertCircle className="w-4 h-4 mt-0.5 shrink-0" />}
              <span>{message.text}</span>
            </div>
          )}

          <form onSubmit={handleUploadSubmit} className="flex flex-col gap-4 text-[13px]">
            <div className="flex flex-col gap-1.5">
              <label className="font-semibold text-slate-700">Garment Name</label>
              <input 
                type="text" 
                placeholder="e.g. Silk Kanjivaram Saree"
                value={name}
                onChange={e => setName(e.target.value)}
                className="w-full px-3 py-2 border border-slate-200 rounded-lg outline-none focus:border-indigo-500 text-[13px] bg-slate-50/50"
              />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="flex flex-col gap-1.5">
                <label className="font-semibold text-slate-700">Category</label>
                <select 
                  value={category} 
                  onChange={e => setCategory(e.target.value)}
                  className="w-full px-3 py-2 border border-slate-200 rounded-lg outline-none bg-slate-50/50"
                >
                  <option value="Sarees">Sarees</option>
                  <option value="Shirts">Shirts</option>
                  <option value="Dresses">Dresses</option>
                  <option value="Jeans">Jeans</option>
                  <option value="Jackets">Jackets</option>
                </select>
              </div>

              <div className="flex flex-col gap-1.5">
                <label className="font-semibold text-slate-700">Target Gender</label>
                <select 
                  value={gender} 
                  onChange={e => setGender(e.target.value)}
                  className="w-full px-3 py-2 border border-slate-200 rounded-lg outline-none bg-slate-50/50"
                >
                  <option value="Women">Women</option>
                  <option value="Men">Men</option>
                </select>
              </div>
            </div>

            <div className="flex flex-col gap-1.5">
              <label className="font-semibold text-slate-700">Primary Color</label>
              <input 
                type="text" 
                placeholder="e.g. Pink, Red, Blue"
                value={color}
                onChange={e => setColor(e.target.value)}
                className="w-full px-3 py-2 border border-slate-200 rounded-lg outline-none focus:border-indigo-500 bg-slate-50/50"
              />
            </div>

            <div className="flex flex-col gap-1.5">
              <label className="font-semibold text-slate-700">Garment Image (Folded/Flat)</label>
              <div className="border-2 border-dashed border-slate-200 rounded-xl p-4 flex flex-col items-center justify-center bg-slate-50/30 hover:bg-slate-50 transition-colors relative group cursor-pointer">
                <input 
                  type="file" 
                  accept="image/*"
                  onChange={handleImageChange}
                  className="absolute inset-0 opacity-0 cursor-pointer"
                />
                
                {imageBase64 ? (
                  <div className="flex flex-col items-center gap-2">
                    <img src={imageBase64} alt="Preview" className="w-[100px] h-[100px] object-cover rounded-lg border shadow-sm" />
                    <span className="text-[11px] text-slate-500 font-semibold">Change photo</span>
                  </div>
                ) : (
                  <div className="flex flex-col items-center gap-1.5 py-4">
                    <Upload className="w-8 h-8 text-slate-400 group-hover:text-indigo-500 transition-colors" />
                    <span className="font-medium text-slate-600">Click to upload image</span>
                    <span className="text-[11px] text-slate-400">PNG, JPG, or WEBP</span>
                  </div>
                )}
              </div>
            </div>

            <button 
              type="submit" 
              disabled={uploading}
              className={`w-full py-2.5 rounded-lg font-bold text-white shadow-md transition-all duration-200 ${
                uploading 
                  ? 'bg-indigo-400 cursor-not-allowed' 
                  : 'bg-indigo-600 hover:bg-indigo-700 shadow-indigo-600/10 hover:shadow-indigo-700/20 cursor-pointer'
              }`}
            >
              {uploading ? "Uploading..." : "Save to Catalogue"}
            </button>
          </form>
        </div>

        {/* Existing garments list */}
        <div className="lg:col-span-2 bg-white border border-slate-200/80 rounded-xl p-5 shadow-sm flex flex-col gap-4">
          <div className="flex items-center justify-between border-b border-slate-100 pb-3">
            <h3 className="font-bold text-[16px] text-slate-900">Current Garments ({garments.length})</h3>
            <button onClick={fetchGarments} className="p-1.5 text-slate-400 hover:text-slate-600 rounded-lg hover:bg-slate-50">
              <RefreshCw className="w-4 h-4" />
            </button>
          </div>

          {loading ? (
            <div className="py-20 flex justify-center"><LoadingSpinner /></div>
          ) : garments.length === 0 ? (
            <div className="py-20 text-center text-slate-400 text-[13px]">
              No garments uploaded yet. Add your first item on the left.
            </div>
          ) : (
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-4 overflow-y-auto max-h-[550px] pr-2">
              {garments.map((g) => (
                <div key={g.id} className="border border-slate-100 hover:border-slate-200/80 rounded-xl overflow-hidden flex flex-col justify-between bg-slate-50/20 group relative shadow-[0_1px_3px_rgba(0,0,0,0.01)] transition-all">
                  <div className="relative aspect-square w-full bg-white flex items-center justify-center p-2">
                    <img 
                      src={g.imageUrl.startsWith("http") ? g.imageUrl : `${API_BASE_URL}${g.imageUrl}`} 
                      alt={g.name} 
                      className="max-h-full max-w-full object-contain rounded-lg"
                    />
                    <button 
                      onClick={() => handleDeleteGarment(g.id)}
                      className="absolute top-2 right-2 p-1.5 bg-white/90 hover:bg-rose-50 text-slate-400 hover:text-rose-600 rounded-full shadow-sm hover:scale-105 transition-all opacity-0 group-hover:opacity-100 cursor-pointer"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  </div>
                  <div className="p-3 bg-white border-t border-slate-100 flex flex-col gap-1 text-[12px]">
                    <span className="font-bold text-slate-800 truncate">{g.name}</span>
                    <div className="flex items-center justify-between text-slate-400">
                      <span>{g.category}</span>
                      <span className="px-1.5 py-0.5 rounded bg-slate-100 text-[10px] font-semibold text-slate-500">{g.color}</span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

// 4. Support Tickets Tab
function SupportTickets() {
  const [tickets, setTickets] = useState<Ticket[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchTickets = () => {
    setLoading(true);
    fetch(`${API_BASE_URL}/api/support/tickets`)
      .then(res => res.json())
      .then(data => {
        if (data.success) {
          setTickets(data.tickets);
        }
        setLoading(false);
      })
      .catch(err => {
        console.error("Error loading tickets:", err);
        setLoading(false);
      });
  };

  useEffect(() => {
    fetchTickets();
  }, []);

  const handleUpdateStatus = async (id: string, currentStatus: string) => {
    const nextStatus = currentStatus === "Open" ? "Resolved" : "Open";
    try {
      const response = await fetch(`${API_BASE_URL}/api/support/tickets/${id}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ status: nextStatus })
      });
      const data = await response.json();
      if (data.success) {
        fetchTickets(); // Refresh
      }
    } catch (err) {
      console.error(err);
    }
  };

  const handleDeleteTicket = async (id: string) => {
    if (!confirm("Delete this ticket?")) return;
    try {
      const response = await fetch(`${API_BASE_URL}/api/support/tickets/${id}`, {
        method: 'DELETE'
      });
      const data = await response.json();
      if (data.success) {
        fetchTickets();
      }
    } catch (err) {
      console.error(err);
    }
  };

  return (
    <div className="flex flex-col gap-6 animate-fadeIn">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="font-bold text-slate-950 text-[26px]">Technical Support Tickets</h1>
          <p className="text-slate-500 text-[14px]">Handle issues raised by users on the smart mirror</p>
        </div>
        <button onClick={fetchTickets} className="p-1.5 text-slate-500 hover:text-slate-800 border border-slate-200 bg-white rounded-lg shadow-sm">
          <RefreshCw className="w-4 h-4" />
        </button>
      </div>

      <div className="bg-white border border-slate-200/80 rounded-xl p-5 shadow-sm flex flex-col gap-4">
        {loading ? (
          <div className="py-20 flex justify-center"><LoadingSpinner /></div>
        ) : tickets.length === 0 ? (
          <div className="py-20 text-center text-slate-400 text-[13px]">
            No support tickets open. Everything is running smoothly!
          </div>
        ) : (
          <div className="flex flex-col gap-4 text-[13px]">
            {tickets.map((t) => (
              <div key={t.id} className="border border-slate-100 hover:border-slate-200/80 p-4 rounded-xl flex flex-col md:flex-row md:items-center justify-between gap-4 bg-slate-50/10">
                <div className="flex flex-col gap-1.5">
                  <div className="flex items-center gap-2">
                    <span className="font-bold text-slate-800 text-[14px]">{t.id}</span>
                    <span className={`px-2 py-0.5 rounded-full text-[10px] font-bold ${
                      t.priority === 'High' ? 'bg-rose-50 text-rose-700' : t.priority === 'Medium' ? 'bg-amber-50 text-amber-700' : 'bg-slate-100 text-slate-600'
                    }`}>
                      {t.priority} Priority
                    </span>
                    <span className="text-[12px] text-slate-400">• {t.category}</span>
                  </div>
                  <h4 className="font-semibold text-slate-900">{t.subject}</h4>
                  <p className="text-slate-500 text-[12px]">{t.description}</p>
                  <span className="text-[11px] text-slate-400">{t.createdAt}</span>
                </div>
                <div className="flex items-center gap-2 self-end md:self-center">
                  <button 
                    onClick={() => handleUpdateStatus(t.id, t.status)}
                    className={`px-3 py-1.5 rounded-lg font-bold border text-[12px] shadow-sm transition-colors cursor-pointer ${
                      t.status === 'Resolved' 
                        ? 'bg-emerald-50 text-emerald-700 border-emerald-100 hover:bg-emerald-100/50' 
                        : 'bg-white text-slate-700 border-slate-200 hover:bg-slate-50'
                    }`}
                  >
                    {t.status === 'Resolved' ? "Mark Open" : "Mark Resolved"}
                  </button>
                  <button 
                    onClick={() => handleDeleteTicket(t.id)}
                    className="p-2 text-slate-400 hover:text-rose-600 hover:bg-rose-50 border border-slate-200 rounded-lg transition-colors cursor-pointer"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

// 5. System Diagnostics Tab
function SystemDiagnostics() {
  const [diagnostics, setDiagnostics] = useState<Diagnostics | null>(null);
  const [loading, setLoading] = useState(true);

  const fetchDiagnostics = () => {
    setLoading(true);
    fetch(`${API_BASE_URL}/api/support/diagnostics`)
      .then(res => res.json())
      .then(data => {
        setDiagnostics(data);
        setLoading(false);
      })
      .catch(err => {
        console.error(err);
        setLoading(false);
      });
  };

  useEffect(() => {
    fetchDiagnostics();
  }, []);

  if (loading) return <LoadingSpinner />;

  return (
    <div className="flex flex-col gap-6 animate-fadeIn">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="font-bold text-slate-950 text-[26px]">System Status & Diagnostics</h1>
          <p className="text-slate-500 text-[14px]">Live status monitoring of all back-end microservices</p>
        </div>
        <button onClick={fetchDiagnostics} className="p-1.5 text-slate-500 hover:text-slate-800 border border-slate-200 bg-white rounded-lg shadow-sm">
          <RefreshCw className="w-4 h-4" />
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 text-[13px]">
        {/* Core System Status */}
        <div className="md:col-span-2 bg-white border border-slate-200/80 rounded-xl p-5 shadow-sm flex flex-col gap-4">
          <h3 className="font-bold text-[16px] text-slate-900 border-b border-slate-100 pb-2">Active Services</h3>
          <div className="flex flex-col gap-3">
            {diagnostics?.services.map((srv, idx) => (
              <div key={idx} className="flex items-center justify-between p-3 rounded-lg border border-slate-100 bg-slate-50/20">
                <div className="flex flex-col">
                  <span className="font-bold text-slate-800">{srv.name}</span>
                  <span className="text-[11px] text-slate-400">{srv.details}</span>
                </div>
                <span className={`px-2 py-0.5 rounded-full text-[10px] font-bold ${
                  srv.status === 'Active' || srv.status === 'Healthy' || srv.status === 'Synced' 
                    ? 'bg-emerald-55/10 text-emerald-700 bg-emerald-50/50' 
                    : 'bg-indigo-50 text-indigo-700'
                }`}>
                  {srv.status}
                </span>
              </div>
            ))}
          </div>
        </div>

        {/* Technical Meta info */}
        <div className="bg-white border border-slate-200/80 rounded-xl p-5 shadow-sm flex flex-col gap-4">
          <h3 className="font-bold text-[16px] text-slate-900 border-b border-slate-100 pb-2">Meta Info</h3>
          <div className="flex flex-col gap-3.5">
            <div className="flex justify-between">
              <span className="text-slate-400">Database Engine:</span>
              <span className={`font-bold ${diagnostics?.supabaseConnected ? 'text-indigo-600' : 'text-slate-700'}`}>
                {diagnostics?.supabaseConnected ? "Supabase Cloud" : "Local garments.json"}
              </span>
            </div>
            <div className="flex justify-between">
              <span className="text-slate-400">Python Runtime:</span>
              <span className="font-semibold text-slate-800">{diagnostics?.pythonVersion || "3.11"}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-slate-400">Flask Port:</span>
              <span className="font-semibold text-slate-800">{diagnostics?.flaskPort || 5000}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-slate-400">Total Clothes:</span>
              <span className="font-bold text-indigo-600">{diagnostics?.garmentsCount || 0}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-slate-400">Server Time:</span>
              <span className="font-semibold text-slate-800">{diagnostics?.serverTime ? new Date(diagnostics.serverTime).toLocaleTimeString() : "—"}</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

function MetricCard({ 
  title, 
  value, 
  subtitle, 
  color 
}: { 
  title: string; 
  value: React.ReactNode; 
  subtitle: string; 
  color: string;
}) {
  return (
    <div className={`bg-white border border-slate-200/80 rounded-xl p-4 shadow-sm border-l-4 ${color}`}>
      <span className="text-[12px] font-bold text-slate-400 uppercase tracking-wider">{title}</span>
      <h2 className="text-[24px] font-bold text-slate-800 my-1">{value}</h2>
      <p className="text-[11px] text-slate-500 truncate">{subtitle}</p>
    </div>
  );
}

function LoadingSpinner() {
  return (
    <div className="flex items-center justify-center py-20 w-full">
      <div className="w-8 h-8 border-4 border-indigo-600/20 border-t-indigo-600 rounded-full animate-spin" />
    </div>
  );
}