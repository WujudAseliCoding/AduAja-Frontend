import { useState } from "react";
import { Card, CardContent } from "../ui/card.jsx";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "../ui/tabs.jsx";
import { Button } from "../ui/button.jsx";
import { Badge } from "../ui/badge.jsx";
import {
  LogOut,
  UserPlus,
  AlertTriangle,
  Building2,
  FileText,
  Clock,
  CheckCircle2,
} from "lucide-react";
import PenugasanPetugas from "./PenugasanPetugas.jsx";
import SengketaPanel from "../SengketaPanel.jsx";

export default function DinasDashboard({ userRole, dinasName, onLogout }) {
  const [activeTab, setActiveTab] = useState("penugasan");

  const stats = [
    {
      title: "Laporan Masuk Baru",
      value: "2",
      icon: FileText,
      color: "text-blue-600",
      bgColor: "bg-blue-100",
    },
    {
      title: "Ditugaskan ke Petugas",
      value: "5",
      icon: Clock,
      color: "text-yellow-600",
      bgColor: "bg-yellow-100",
    },
    {
      title: "Selesai Bulan Ini",
      value: "18",
      icon: CheckCircle2,
      color: "text-green-600",
      bgColor: "bg-green-100",
    },
    {
      title: "Sengketa Aktif",
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
                Dashboard {dinasName}
              </h1>
              <div className="flex items-center gap-2 mt-1">
                <Badge variant="outline" className="bg-green-50">
                  <Building2 className="w-3 h-3 mr-1" />
                  Administrator Dinas
                </Badge>
              </div>
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

        <Alert className="mb-6 border-green-500 bg-green-50">
          <Building2 className="h-4 w-4 text-green-600" />
          <AlertDescription className="text-green-800 text-sm">
            <strong>Peran Admin Dinas:</strong> Menerima laporan dari disposisi
            Admin Pusat -&gt; Tugaskan ke Petugas Lapangan (FR-PRS) -&gt; Handle
            sengketa dari warga (FR-RSL)
          </AlertDescription>
        </Alert>

        <Tabs
          value={activeTab}
          onValueChange={setActiveTab}
          className="space-y-4"
        >
          <TabsList className="grid w-full grid-cols-2 lg:w-auto">
            <TabsTrigger value="penugasan">
              <UserPlus className="w-4 h-4 mr-2" />
              Penugasan Petugas (FR-PRS)
            </TabsTrigger>
            <TabsTrigger value="sengketa">
              <AlertTriangle className="w-4 h-4 mr-2" />
              Sengketa (FR-RSL-11 s/d 13)
            </TabsTrigger>
          </TabsList>

          <TabsContent value="penugasan" className="space-y-4">
            <PenugasanPetugas />
          </TabsContent>

          <TabsContent value="sengketa" className="space-y-4">
            <SengketaPanel userRole={userRole} />
          </TabsContent>
        </Tabs>
      </main>
    </div>
  );
}

function Alert({ children, className }) {
  return <div className={`p-4 rounded-lg border ${className}`}>{children}</div>;
}

function AlertDescription({ children, className }) {
  return <div className={className}>{children}</div>;
}
