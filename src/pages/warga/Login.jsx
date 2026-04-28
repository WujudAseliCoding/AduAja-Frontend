import { useState } from "react";
import { Mail, Lock, Phone, User, Eye, EyeOff } from "lucide-react";

export default function Login({ onLogin, onNavigate }) {
  const [isRegister, setIsRegister] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [formData, setFormData] = useState({
    email: "",
    password: "",
    name: "",
    nik: "",
    phone: "",
  });
  const [otpStep, setOtpStep] = useState(false);
  const [otp, setOtp] = useState(["", "", "", "", "", ""]);

  const handleInputChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleOtpChange = (index, value) => {
    if (value.length <= 1) {
      const newOtp = [...otp];
      newOtp[index] = value;
      setOtp(newOtp);

      if (value && index < 5) {
        const nextInput = document.getElementById(`otp-${index + 1}`);
        nextInput?.focus();
      }
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (isRegister && !otpStep) {
      setOtpStep(true);
    } else if (otpStep) {
      onLogin();
    } else {
      onLogin();
    }
  };

  return (
    <div className="min-h-screen flex flex-col lg:flex-row">
      {/* Left Section - Branding */}
      <div className="hidden lg:flex lg:w-1/2 bg-gradient-to-br from-blue-600 to-blue-800 p-12 items-center justify-center">
        <div className="max-w-md text-white">
          <h1 className="text-5xl font-bold mb-6">AduAja</h1>
          <p className="text-xl mb-8">
            Sistem Informasi Pengaduan dan Aspirasi Masyarakat
          </p>
          <div className="space-y-4">
            <div className="flex items-start gap-3">
              <div className="w-8 h-8 bg-white/20 rounded-full flex items-center justify-center flex-shrink-0 mt-1">
                <span className="text-sm">✓</span>
              </div>
              <div>
                <h3 className="font-semibold mb-1">Lapor Mudah</h3>
                <p className="text-blue-100">
                  Laporkan kerusakan infrastruktur dengan foto dan lokasi GPS
                </p>
              </div>
            </div>
            <div className="flex items-start gap-3">
              <div className="w-8 h-8 bg-white/20 rounded-full flex items-center justify-center flex-shrink-0 mt-1">
                <span className="text-sm">✓</span>
              </div>
              <div>
                <h3 className="font-semibold mb-1">Pantau Status</h3>
                <p className="text-blue-100">
                  Lacak progress penanganan laporan secara real-time
                </p>
              </div>
            </div>
            <div className="flex items-start gap-3">
              <div className="w-8 h-8 bg-white/20 rounded-full flex items-center justify-center flex-shrink-0 mt-1">
                <span className="text-sm">✓</span>
              </div>
              <div>
                <h3 className="font-semibold mb-1">Transparan</h3>
                <p className="text-blue-100">
                  Sistem SLA dan notifikasi otomatis
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Right Section - Form */}
      <div className="flex-1 flex items-center justify-center p-6 lg:p-12">
        <div className="w-full max-w-md">
          {/* Mobile Header */}
          <div className="lg:hidden text-center mb-8">
            <h1 className="text-3xl font-bold text-blue-600 mb-2">AduAja</h1>
            <p className="text-gray-600">Pengaduan & Aspirasi Masyarakat</p>
          </div>

          <div className="bg-white rounded-2xl shadow-xl p-8">
            <h2 className="text-2xl font-bold text-gray-900 mb-2">
              {otpStep
                ? "Verifikasi OTP"
                : isRegister
                  ? "Daftar Akun"
                  : "Masuk"}
            </h2>
            <p className="text-gray-600 mb-6">
              {otpStep
                ? `Kode OTP telah dikirim ke ${formData.email || formData.phone}`
                : isRegister
                  ? "Buat akun untuk mulai melaporkan"
                  : "Masuk untuk melanjutkan"}
            </p>

            <form onSubmit={handleSubmit} className="space-y-4">
              {otpStep ? (
                <>
                  <div className="flex gap-2 justify-center mb-6">
                    {otp.map((digit, index) => (
                      <input
                        key={index}
                        id={`otp-${index}`}
                        type="text"
                        maxLength={1}
                        value={digit}
                        onChange={(e) => handleOtpChange(index, e.target.value)}
                        className="w-12 h-14 text-center text-xl font-bold border-2 border-gray-300 rounded-lg focus:border-blue-500 focus:outline-none"
                      />
                    ))}
                  </div>
                  <button
                    type="button"
                    className="text-blue-600 text-sm hover:underline"
                  >
                    Kirim Ulang OTP
                  </button>
                </>
              ) : (
                <>
                  {isRegister && (
                    <>
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          Nama Lengkap
                        </label>
                        <div className="relative">
                          <User className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                          <input
                            type="text"
                            name="name"
                            value={formData.name}
                            onChange={handleInputChange}
                            className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                            placeholder="Masukkan nama lengkap"
                            required
                          />
                        </div>
                      </div>

                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          NIK
                        </label>
                        <input
                          type="text"
                          name="nik"
                          value={formData.nik}
                          onChange={handleInputChange}
                          maxLength={16}
                          className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                          placeholder="16 digit NIK"
                          required
                        />
                      </div>

                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          Nomor HP
                        </label>
                        <div className="relative">
                          <Phone className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                          <input
                            type="tel"
                            name="phone"
                            value={formData.phone}
                            onChange={handleInputChange}
                            className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                            placeholder="08xxxxxxxxxx"
                            required
                          />
                        </div>
                      </div>
                    </>
                  )}

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Email
                    </label>
                    <div className="relative">
                      <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                      <input
                        type="email"
                        name="email"
                        value={formData.email}
                        onChange={handleInputChange}
                        className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                        placeholder="nama@email.com"
                        required
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Password
                    </label>
                    <div className="relative">
                      <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                      <input
                        type={showPassword ? "text" : "password"}
                        name="password"
                        value={formData.password}
                        onChange={handleInputChange}
                        className="w-full pl-10 pr-12 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                        placeholder="Min. 8 karakter"
                        required
                      />
                      <button
                        type="button"
                        onClick={() => setShowPassword(!showPassword)}
                        className="absolute right-3 top-1/2 -translate-y-1/2"
                      >
                        {showPassword ? (
                          <EyeOff className="w-5 h-5 text-gray-400" />
                        ) : (
                          <Eye className="w-5 h-5 text-gray-400" />
                        )}
                      </button>
                    </div>
                  </div>

                  {!isRegister && (
                    <div className="flex items-center justify-between text-sm">
                      <label className="flex items-center">
                        <input
                          type="checkbox"
                          className="rounded border-gray-300 text-blue-600 mr-2"
                        />
                        <span className="text-gray-600">Ingat saya</span>
                      </label>
                      <button
                        type="button"
                        className="text-blue-600 hover:underline"
                      >
                        Lupa password?
                      </button>
                    </div>
                  )}
                </>
              )}

              <button
                type="submit"
                className="w-full bg-blue-600 text-white py-3 rounded-lg font-medium hover:bg-blue-700 transition-colors"
              >
                {otpStep ? "Verifikasi" : isRegister ? "Daftar" : "Masuk"}
              </button>
            </form>

            {!otpStep && (
              <div className="mt-6 text-center">
                <button
                  onClick={() => {
                    setIsRegister(!isRegister);
                    setOtpStep(false);
                  }}
                  className="text-gray-600"
                >
                  {isRegister ? "Sudah punya akun? " : "Belum punya akun? "}
                  <span className="text-blue-600 font-medium hover:underline">
                    {isRegister ? "Masuk" : "Daftar"}
                  </span>
                </button>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
