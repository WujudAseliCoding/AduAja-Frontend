import { useState } from "react";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "./ui/card.jsx";
import { Input } from "./ui/input.jsx";
import { Button } from "./ui/button.jsx";
import { Label } from "./ui/label.jsx";
import { Alert, AlertDescription } from "./ui/alert.jsx";
import { Eye, EyeOff, Shield, AlertCircle } from "lucide-react";

export default function LoginPage({ onLogin }) {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [role, setRole] = useState("admin_pusat");
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = (e) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    setTimeout(() => {
      if (!email || !password) {
        setError("Email dan password wajib diisi");
        setLoading(false);
        return;
      }

      if (password.length < 8) {
        setError(
          "Password harus minimal 8 karakter (kombinasi huruf kapital, angka, dan simbol)",
        );
        setLoading(false);
        return;
      }

      onLogin(role);
    }, 1000);
  };

  return (
    <div className="min-h-screen w-full flex items-center justify-center bg-gradient-to-br from-blue-50 to-indigo-100 p-4">
      <Card className="w-full max-w-md shadow-xl">
        <CardHeader className="space-y-1 text-center">
          <div className="mx-auto bg-blue-600 w-16 h-16 rounded-full flex items-center justify-center mb-4">
            <Shield className="w-8 h-8 text-white" />
          </div>
          <CardTitle className="text-3xl font-bold">Sistem AduAja</CardTitle>
          <CardDescription className="text-base">
            Sistem Informasi Pengaduan dan Aspirasi Masyarakat
          </CardDescription>
        </CardHeader>

        <form onSubmit={handleSubmit}>
          <CardContent className="space-y-4">
            {error && (
              <Alert variant="destructive">
                <AlertCircle className="h-4 w-4" />
                <AlertDescription>{error}</AlertDescription>
              </Alert>
            )}

            <div className="space-y-2">
              <Label htmlFor="role">Role Administrator</Label>
              <select
                id="role"
                value={role}
                onChange={(e) => setRole(e.target.value)}
                className="w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                <option value="admin_pusat">
                  Admin Pusat (Validasi & Disposisi)
                </option>
                <option value="admin_dinas">
                  Admin Dinas PU & Penataan Ruang
                </option>
                <option value="admin_dinas_dlh">
                  Admin Dinas Lingkungan Hidup
                </option>
                <option value="admin_dinas_esdm">Admin Dinas ESDM</option>
                <option value="admin_dinas_perhubungan">
                  Admin Dinas Perhubungan
                </option>
              </select>
            </div>

            <div className="space-y-2">
              <Label htmlFor="email">Email / Nomor HP</Label>
              <Input
                id="email"
                type="text"
                placeholder="admin@aduaja.go.id"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="password">Password</Label>
              <div className="relative">
                <Input
                  id="password"
                  type={showPassword ? "text" : "password"}
                  placeholder="Masukkan password Anda"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                  className="pr-10"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 hover:text-gray-700"
                >
                  {showPassword ? (
                    <EyeOff className="w-4 h-4" />
                  ) : (
                    <Eye className="w-4 h-4" />
                  )}
                </button>
              </div>
            </div>

            <div className="flex items-center justify-between text-sm">
              <label className="flex items-center space-x-2 cursor-pointer">
                <input type="checkbox" className="rounded" />
                <span className="text-gray-600">Ingat saya</span>
              </label>
              <a href="#" className="text-blue-600 hover:underline">
                Lupa password?
              </a>
            </div>
          </CardContent>

          <CardFooter className="flex flex-col space-y-3">
            <Button
              type="submit"
              className="w-full bg-blue-600 hover:bg-blue-700"
              disabled={loading}
            >
              {loading ? "Memproses..." : "Login"}
            </Button>

            <p className="text-xs text-center text-gray-500">
              Sistem terlindungi dengan enkripsi SSL/TLS
            </p>
          </CardFooter>
        </form>
      </Card>
    </div>
  );
}
