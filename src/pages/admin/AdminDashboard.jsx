import { useState } from "react";
import { Card, CardContent } from "./ui/card.jsx";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "./ui/tabs.jsx";
import { Button } from "./ui/button.jsx";
import { Badge } from "./ui/badge.jsx";
import {
  LogOut,
  FileText,
  Clock,
  CheckCircle2,
  AlertTriangle,
  Users,
  MapPin,
} from "lucide-react";
import LaporanQueue from "./LaporanQueue.jsx";
import ValidationPanel from "./ValidationPanel.jsx";
import MergeTicketPanel from "./MergeTicketPanel.jsx";
import DisposisiPanel from "./DisposisiPanel.jsx";

export default function AdminDashboard({ userRole, onLogout }) {
  const [activeTab, setActiveTab] = useState("queue");
  const [selectedLaporanForValidation, setSelectedLaporanForValidation] =
    useState(null);

  const handleNavigateToValidation = (laporan) => {
    setSelectedLaporanForValidation(laporan);
    setActiveTab("validation");
  };

  const stats = [
    {
      title: "Menunggu Validasi",
      value: "24",
      icon: Clock,
      color: "text-yellow-600",
      bgColor: "bg-yellow-100",
    },
    {
      title: "Sedang Diproses",
      value: "18",
      icon: FileText,
      color: "text-blue-600",
      bgColor: "bg-blue-100",
    },
    {
      title: "Selesai Hari Ini",
      value: "12",
      icon: CheckCircle2,
      color: "text-green-600",
      bgColor: "bg-green-100",
    },
    {
      title: "Terlambat (SLA)",
      value: "3",
      icon: AlertTriangle,
      color: "text-red-600",
      bgColor: "bg-red-100",
    },
  ];

  return (
    <div className="min-h-screen bg-gray-50">
      <header className="bg-white border-b sticky top-0 z-10">
        <div className="px-6 py-4">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-2xl font-bold text-gray-900">
                Dashboard Admin AduAja
              </h1>
              <p className="text-sm text-gray-600">
                <Badge variant="outline" className="mt-1">
                  {userRole === "admin_pusat"
                    ? "Administrator Pusat"
                    : "Administrator Dinas"}
                </Badge>
              </p>
            </div>
            <Button
              variant="outline"
              onClick={onLogout}
              className="flex items-center gap-2"
            >
              <LogOut className="w-4 h-4" />
              Logout
            </Button>
          </div>
        </div>
      </header>

      <main className="p-6 max-w-[1400px] mx-auto">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
          {stats.map((stat, index) => (
            <Card key={index}>
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-gray-600">
                      {stat.title}
                    </p>
                    <h3 className="text-3xl font-bold mt-2">{stat.value}</h3>
                  </div>
                  <div className={`p-3 rounded-lg ${stat.bgColor}`}>
                    <stat.icon className={`w-6 h-6 ${stat.color}`} />
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        <div className="mb-6 p-4 rounded-lg border border-blue-500 bg-blue-50">
          <div className="flex items-start gap-2">
            <AlertTriangle className="h-5 w-5 text-blue-600 mt-0.5" />
            <div className="text-blue-800 text-sm">
              <strong>Peran Admin Pusat:</strong> Validator & Dispatcher -
              Menerima laporan dari warga -&gt; Validasi (FR-ADM-05 s/d 10)
              -&gt; Deteksi & Merge duplikat (FR-ADM-11 s/d 18) -&gt; Disposisi
              ke Dinas tujuan (FR-DSP-01 s/d 06)
            </div>
          </div>
        </div>

        <Tabs
          value={activeTab}
          onValueChange={setActiveTab}
          className="space-y-4"
        >
          <TabsList className="grid w-full grid-cols-4 lg:w-auto">
            <TabsTrigger value="queue">
              <FileText className="w-4 h-4 mr-2" />
              Antrean Laporan
            </TabsTrigger>
            <TabsTrigger value="validation">
              <CheckCircle2 className="w-4 h-4 mr-2" />
              Validasi (FR-ADM)
            </TabsTrigger>
            <TabsTrigger value="merge">
              <Users className="w-4 h-4 mr-2" />
              Merge Tiket (FR-ADM)
            </TabsTrigger>
            <TabsTrigger value="disposisi">
              <MapPin className="w-4 h-4 mr-2" />
              Disposisi (FR-DSP)
            </TabsTrigger>
          </TabsList>

          <TabsContent value="queue" className="space-y-4">
            <LaporanQueue
              userRole={userRole}
              onNavigateToValidation={handleNavigateToValidation}
            />
          </TabsContent>

          <TabsContent value="validation" className="space-y-4">
            <ValidationPanel
              userRole={userRole}
              selectedLaporan={selectedLaporanForValidation}
            />
          </TabsContent>

          <TabsContent value="merge" className="space-y-4">
            <MergeTicketPanel userRole={userRole} />
          </TabsContent>

          <TabsContent value="disposisi" className="space-y-4">
            <DisposisiPanel userRole={userRole} />
          </TabsContent>
        </Tabs>
      </main>
    </div>
  );
}
