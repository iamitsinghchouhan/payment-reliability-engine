import React, { useState, useEffect } from "react";
import { 
  Activity, 
  ArrowRightLeft, 
  Clock, 
  Database, 
  RefreshCcw, 
  ShieldAlert, 
  ShieldCheck, 
  Terminal,
  Server
} from "lucide-react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";

export default function Dashboard() {
  const [currentTime, setCurrentTime] = useState(new Date());

  useEffect(() => {
    const timer = setInterval(() => setCurrentTime(new Date()), 1000);
    return () => clearInterval(timer);
  }, []);

  const recentTransactions = [
    { id: "tx_9f8d7e6c", status: "SUCCESS", amount: "$149.99", gateway: "Stripe", time: "2s ago", retries: 0 },
    { id: "tx_1a2b3c4d", status: "RETRYING", amount: "$2,400.00", gateway: "Adyen", time: "12s ago", retries: 2 },
    { id: "tx_5e6f7g8h", status: "PENDING", amount: "$12.50", gateway: "PayPal", time: "45s ago", retries: 0 },
    { id: "tx_9i0j1k2l", status: "FAILED", amount: "$89.00", gateway: "Stripe", time: "2m ago", retries: 5 },
    { id: "tx_3m4n5o6p", status: "SUCCESS", amount: "$999.00", gateway: "Bank Transfer", time: "5m ago", retries: 1 },
  ];

  const getStatusColor = (status: string) => {
    switch (status) {
      case "SUCCESS": return "bg-emerald-500/10 text-emerald-500 border-emerald-500/20";
      case "PENDING": return "bg-blue-500/10 text-blue-500 border-blue-500/20";
      case "RETRYING": return "bg-amber-500/10 text-amber-500 border-amber-500/20";
      case "FAILED": return "bg-red-500/10 text-red-500 border-red-500/20";
      default: return "bg-gray-500/10 text-gray-500 border-gray-500/20";
    }
  };

  return (
    <div className="min-h-screen bg-background text-foreground flex flex-col font-sans subtle-grid">
      {/* Header */}
      <header className="border-b border-white/5 bg-background/80 backdrop-blur-md sticky top-0 z-10">
        <div className="container mx-auto px-4 h-16 flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <div className="w-8 h-8 rounded-md bg-primary flex items-center justify-center glow-effect">
              <ShieldCheck className="w-5 h-5 text-primary-foreground" />
            </div>
            <h1 className="font-semibold tracking-tight text-lg">Payment Reliability Engine</h1>
            <Badge variant="outline" className="ml-2 font-mono text-xs text-muted-foreground border-white/10">
              v1.4.2-go
            </Badge>
          </div>
          <div className="flex items-center space-x-4 text-sm">
            <div className="flex items-center text-emerald-500">
              <div className="w-2 h-2 rounded-full bg-emerald-500 mr-2 animate-pulse" />
              SQLite Persistent
            </div>
            <div className="text-muted-foreground font-mono bg-white/5 px-3 py-1 rounded-md">
              {currentTime.toISOString().split('T')[1].split('.')[0]} UTC
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="flex-1 container mx-auto px-4 py-8 space-y-6">
        
        {/* Stats Row */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          <Card className="glass-panel border-white/5">
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm font-medium text-muted-foreground">Throughput</CardTitle>
              <Activity className="w-4 h-4 text-emerald-500" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">2,405 <span className="text-sm text-muted-foreground font-normal">req/s</span></div>
              <p className="text-xs text-emerald-500 mt-1 flex items-center">
                <span className="font-mono">↑ 12%</span> from last hour
              </p>
            </CardContent>
          </Card>
          
          <Card className="glass-panel border-white/5">
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm font-medium text-muted-foreground">Success Rate</CardTitle>
              <ShieldCheck className="w-4 h-4 text-blue-500" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">99.98%</div>
              <p className="text-xs text-muted-foreground mt-1">
                Last 24 hours
              </p>
            </CardContent>
          </Card>
          
          <Card className="glass-panel border-white/5">
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm font-medium text-muted-foreground">Active Retries</CardTitle>
              <RefreshCcw className="w-4 h-4 text-amber-500" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">142</div>
              <p className="text-xs text-amber-500 mt-1 flex items-center">
                Exponential backoff active
              </p>
            </CardContent>
          </Card>
          
          <Card className="glass-panel border-white/5">
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm font-medium text-muted-foreground">Dead Letter Queue</CardTitle>
              <ShieldAlert className="w-4 h-4 text-red-500" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">7</div>
              <p className="text-xs text-muted-foreground mt-1">
                Requires manual intervention
              </p>
            </CardContent>
          </Card>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Left Column: Transaction Feed */}
          <div className="lg:col-span-2 space-y-6">
            <Card className="glass-panel border-white/5 h-full">
              <CardHeader className="flex flex-row items-center justify-between">
                <div>
                  <CardTitle>Live Transactions</CardTitle>
                  <CardDescription>Real-time view of the payment state machine</CardDescription>
                </div>
                <Button variant="outline" size="sm" className="border-white/10" data-testid="button-refresh-tx">
                  <RefreshCcw className="w-4 h-4 mr-2" /> Refresh
                </Button>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {recentTransactions.map((tx) => (
                    <div key={tx.id} className="flex items-center justify-between p-4 rounded-lg bg-white/5 border border-white/5 hover:bg-white/10 transition-colors">
                      <div className="flex items-center space-x-4">
                        <div className={`p-2 rounded-full ${getStatusColor(tx.status).split(' ')[0]}`}>
                          <ArrowRightLeft className={`w-4 h-4 ${getStatusColor(tx.status).split(' ')[1]}`} />
                        </div>
                        <div>
                          <div className="font-mono text-sm font-medium">{tx.id}</div>
                          <div className="text-xs text-muted-foreground flex items-center mt-1">
                            <span>{tx.gateway}</span>
                            <span className="mx-2">•</span>
                            <span>{tx.time}</span>
                          </div>
                        </div>
                      </div>
                      
                      <div className="flex items-center space-x-6">
                        <div className="text-right">
                          <div className="font-medium">{tx.amount}</div>
                          {tx.retries > 0 && (
                            <div className="text-xs text-amber-500 font-mono mt-1">
                              Retry {tx.retries}/5
                            </div>
                          )}
                        </div>
                        <Badge className={`${getStatusColor(tx.status)} px-2 py-0.5`}>
                          {tx.status}
                        </Badge>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Right Column: Engine Status & Logs */}
          <div className="space-y-6">
            {/* System Components */}
            <Card className="glass-panel border-white/5">
              <CardHeader>
                <CardTitle>Engine Architecture</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex items-center justify-between">
                  <div className="flex items-center text-sm">
                    <Server className="w-4 h-4 mr-2 text-blue-400" />
                    HTTP API Server
                  </div>
                  <Badge variant="outline" className="border-emerald-500/30 text-emerald-500 bg-emerald-500/10">Healthy</Badge>
                </div>
                <div className="flex items-center justify-between">
                  <div className="flex items-center text-sm">
                    <Database className="w-4 h-4 mr-2 text-blue-400" />
                    SQLite Persistence
                  </div>
                  <Badge variant="outline" className="border-emerald-500/30 text-emerald-500 bg-emerald-500/10">Healthy</Badge>
                </div>
                <div className="flex items-center justify-between">
                  <div className="flex items-center text-sm">
                    <RefreshCcw className="w-4 h-4 mr-2 text-blue-400" />
                    Retry Worker Pool
                  </div>
                  <Badge variant="outline" className="border-emerald-500/30 text-emerald-500 bg-emerald-500/10">Active (4)</Badge>
                </div>
                <div className="flex items-center justify-between">
                  <div className="flex items-center text-sm">
                    <Clock className="w-4 h-4 mr-2 text-blue-400" />
                    State Machine Monitor
                  </div>
                  <Badge variant="outline" className="border-emerald-500/30 text-emerald-500 bg-emerald-500/10">Watching</Badge>
                </div>
              </CardContent>
            </Card>

            {/* Terminal / Logs */}
            <Card className="glass-panel border-white/5 bg-[#0a0a0a]">
              <CardHeader className="py-3 border-b border-white/5">
                <CardTitle className="text-xs font-mono flex items-center text-muted-foreground">
                  <Terminal className="w-3 h-3 mr-2" /> system.log
                </CardTitle>
              </CardHeader>
              <CardContent className="p-4 font-mono text-[10px] space-y-2 h-[200px] overflow-y-auto">
                <div className="text-emerald-500">[INFO] main.go:42 - Starting Payment Reliability Engine v1.4.2</div>
                <div className="text-emerald-500">[INFO] db.go:18 - SQLite database initialized at ./data/engine.db</div>
                <div className="text-emerald-500">[INFO] workers.go:55 - Spawning 4 retry workers...</div>
                <div className="text-blue-400">[DEBUG] server.go:88 - HTTP server listening on :8080</div>
                <div className="text-blue-400">[DEBUG] tx.go:102 - Processing new transaction tx_9f8d7e6c</div>
                <div className="text-amber-500">[WARN] gateway.go:210 - Upstream timeout from Adyen for tx_1a2b3c4d</div>
                <div className="text-blue-400">[DEBUG] state.go:45 - Transitioning tx_1a2b3c4d PENDING -&gt; RETRYING</div>
                <div className="text-blue-400">[DEBUG] workers.go:112 - Worker 2 scheduled retry for tx_1a2b3c4d in 15s</div>
                <div className="text-red-500">[ERROR] gateway.go:245 - Payment declined: Insufficient funds (tx_9i0j1k2l)</div>
                <div className="text-blue-400">[DEBUG] state.go:45 - Transitioning tx_9i0j1k2l RETRYING -&gt; FAILED</div>
              </CardContent>
            </Card>
          </div>
        </div>
      </main>
    </div>
  );
}