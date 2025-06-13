import { useState, useEffect } from "react"
import { useNavigate } from "react-router-dom"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Switch } from "@/components/ui/switch"
import { ChevronRight, Trophy, Users, Menu, X, LineChart, Zap, Target, BarChart3, TrendingUp, Play } from "lucide-react"
import { PlanSelectionModal } from "@/components/plan-selection-modal"
import { AuthModal } from "@/components/auth-modal"
import { ThemeProvider } from "@/components/theme-provider"
import { DashboardHeader } from "@/components/dashboard-header"
import { PlayerStatsDashboard } from "@/components/player-stats-dashboard"
import { generatePDF } from "@/utils/pdf-export"

export default function BaseballLanding() {
  const navigate = useNavigate()
  const [isScrolled, setIsScrolled] = useState(false)
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)
  const [isAnnual, setIsAnnual] = useState(false)
  const [showPlanModal, setShowPlanModal] = useState(false)
  const [showAuthModal, setShowAuthModal] = useState(false)
  const [selectedPlan, setSelectedPlan] = useState<{
    type: "starter" | "premium"
    billing: "monthly" | "annual"
  } | null>(null)
  const [isLoggedIn, setIsLoggedIn] = useState(false)
  const [user, setUser] = useState<any>(null)

  useEffect(() => {
    const handleScroll = () => {
      if (window.scrollY > 10) {
        setIsScrolled(true)
      } else {
        setIsScrolled(false)
      }
    }

    // Check if user is logged in
    const savedUser = localStorage.getItem("user")
    if (savedUser) {
      setUser(JSON.parse(savedUser))
      setIsLoggedIn(true)
    }

    window.addEventListener("scroll", handleScroll)
    return () => window.removeEventListener("scroll", handleScroll)
  }, [])

  const handleGetStarted = () => {
    setShowPlanModal(true)
  }

  const handlePlanSelect = (plan: { type: "starter" | "premium"; billing: "monthly" | "annual" }) => {
    setSelectedPlan(plan)
    setShowPlanModal(false)
    setShowAuthModal(true)
  }

  const handleAuthSuccess = () => {
    setShowAuthModal(false)
    setIsLoggedIn(true)
    const savedUser = localStorage.getItem("user")
    if (savedUser) {
      setUser(JSON.parse(savedUser))
    }
  }

  const handleLogout = () => {
    localStorage.removeItem("user")
    setUser(null)
    setIsLoggedIn(false)
  }

  const handleExportPDF = () => {
    // Get current stats from localStorage or state
    const stats = {
      name: "Sample Player",
      position: "1B",
      team: "Sample Team",
      games: 162,
      atBats: 600,
      runs: 100,
      hits: 180,
      doubles: 35,
      triples: 5,
      homeRuns: 25,
      rbi: 95,
      stolenBases: 10,
      caughtStealing: 3,
      walks: 70,
      strikeouts: 120,
      battingAverage: 0.3,
      onBasePercentage: 0.37,
      sluggingPercentage: 0.5,
      ops: 0.87,
    }
    generatePDF(stats, "en") // You can get language from theme context
  }

  const scrollToSection = (sectionId: string) => {
    const element = document.getElementById(sectionId);
    if (element) {
      element.scrollIntoView({ behavior: 'smooth' });
    }
    setMobileMenuOpen(false);
  };

  if (isLoggedIn) {
    return (
      <ThemeProvider>
        <div className="min-h-screen bg-background text-foreground">
          <DashboardHeader onExportPDF={handleExportPDF} onLogout={handleLogout} />
          <PlayerStatsDashboard />
        </div>
      </ThemeProvider>
    )
  }

  return (
    <div className="flex flex-col min-h-dvh bg-[#0a0a0a] text-white relative overflow-hidden">
      {/* Dot pattern background */}
      <div
        className="fixed inset-0 opacity-[0.15]"
        style={{
          backgroundImage: `radial-gradient(circle, rgba(255,255,255,0.1) 1px, transparent 1px)`,
          backgroundSize: "24px 24px",
        }}
      />

      <header
        className={`px-6 lg:px-12 h-20 flex items-center fixed top-0 w-full z-50 transition-all duration-500 ${
          isScrolled ? "bg-[#0a0a0a]/90 backdrop-blur-xl border-b border-white/5" : "bg-transparent"
        }`}
      >
        <button onClick={() => window.scrollTo(0, 0)} className="flex items-center justify-center gap-3">
          <div className="w-8 h-8 bg-white rounded-sm flex items-center justify-center">
            <Target className="h-5 w-5 text-black" />
          </div>
          <span className="font-light text-xl tracking-[0.2em] text-white">BASEBALL STATS</span>
        </button>
        <nav className="hidden lg:flex ml-auto gap-12">
          <button
            onClick={() => scrollToSection('features')}
            className="text-sm font-light text-white/60 hover:text-white transition-all duration-300 tracking-wider"
          >
            FEATURES
          </button>
          <button
            onClick={() => scrollToSection('analytics')}
            className="text-sm font-light text-white/60 hover:text-white transition-all duration-300 tracking-wider"
          >
            ANALYTICS
          </button>
          <button
            onClick={() => scrollToSection('pricing')}
            className="text-sm font-light text-white/60 hover:text-white transition-all duration-300 tracking-wider"
          >
            PRICING
          </button>
        </nav>
        <div className="hidden lg:flex items-center ml-12 gap-6">
          <Button variant="ghost" className="text-white/60 hover:text-white hover:bg-white/5 font-light tracking-wider">
            Sign In
          </Button>
          <Button
            onClick={handleGetStarted}
            className="bg-white text-black hover:bg-white/90 font-light tracking-wider px-6"
          >
            Get Started
          </Button>
        </div>
        <button className="ml-auto lg:hidden" onClick={() => setMobileMenuOpen(!mobileMenuOpen)}>
          {mobileMenuOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
        </button>
      </header>

      {/* Mobile menu */}
      {mobileMenuOpen && (
        <div className="fixed inset-0 z-40 bg-[#0a0a0a] pt-20 px-6 flex flex-col lg:hidden">
          <nav className="flex flex-col gap-8 py-12">
            <button
              onClick={() => scrollToSection('features')}
              className="text-2xl font-light tracking-wider border-b border-white/10 pb-6 text-left"
            >
              FEATURES
            </button>
            <button
              onClick={() => scrollToSection('analytics')}
              className="text-2xl font-light tracking-wider border-b border-white/10 pb-6 text-left"
            >
              ANALYTICS
            </button>
            <button
              onClick={() => scrollToSection('pricing')}
              className="text-2xl font-light tracking-wider border-b border-white/10 pb-6 text-left"
            >
              PRICING
            </button>
          </nav>
        </div>
      )}

      <main className="flex-1 pt-20 relative z-10">
        {/* Hero Section */}
        <section className="w-full py-24 md:py-32 lg:py-48 relative">
          <div className="container px-6 md:px-12 max-w-7xl mx-auto">
            <div className="max-w-4xl mx-auto text-center space-y-12">
              <div className="space-y-8">
                <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full border border-white/10 bg-white/5 backdrop-blur-sm">
                  <div className="w-2 h-2 bg-green-400 rounded-full animate-pulse" />
                  <span className="text-sm font-light tracking-wider text-white/80">LIVE DATA</span>
                </div>

                <h1 className="text-5xl md:text-7xl lg:text-8xl font-extralight tracking-[-0.02em] leading-[0.9]">
                  BASEBALL
                  <br />
                  <span className="text-white/40">ANALYTICS</span>
                  <br />
                  REDEFINED
                </h1>

                <p className="text-lg md:text-xl font-light text-white/60 max-w-2xl mx-auto leading-relaxed">
                  Advanced metrics and real-time insights that transform how you understand America's pastime.
                </p>
              </div>

              <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
                <Button
                  onClick={handleGetStarted}
                  size="lg"
                  className="bg-white text-black hover:bg-white/90 font-light tracking-wider px-8 h-12"
                >
                  Start Free Trial
                </Button>
                <Button
                  variant="ghost"
                  size="lg"
                  className="text-white/60 hover:text-white hover:bg-white/5 font-light tracking-wider px-8 h-12 group"
                >
                  <Play className="h-4 w-4 mr-2 group-hover:scale-110 transition-transform" />
                  Watch Demo
                </Button>
              </div>

              <div className="pt-12">
                <div className="relative mx-auto max-w-5xl">
                  <div className="absolute -inset-1 bg-gradient-to-r from-white/10 via-white/5 to-white/10 rounded-2xl blur-xl" />
                  <div className="relative bg-[#0a0a0a]/80 backdrop-blur-sm p-2 rounded-2xl border border-white/10">
                    <img
                      src="/placeholder.svg?height=600&width=1000"
                      width={1000}
                      height={600}
                      alt="Baseball Analytics Dashboard"
                      className="rounded-xl w-full opacity-90"
                    />
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Stadium Image Section */}
        <section className="w-full py-16 relative overflow-hidden">
          <div className="absolute inset-0 bg-gradient-to-b from-[#0a0a0a] via-transparent to-[#0a0a0a] z-10" />
          <div className="relative h-[50vh] md:h-[60vh] w-full">
            <img
              src="/placeholder.svg?height=600&width=1200"
              alt="Baseball Stadium"
              className="w-full h-full object-cover opacity-60"
            />
          </div>
          <div className="absolute inset-0 flex items-center justify-center z-20">
            <div className="text-center px-6">
              <h2 className="text-4xl md:text-6xl font-extralight tracking-[-0.02em] mb-6 text-white">
                THE GAME
                <br />
                <span className="text-white/40">IN NUMBERS</span>
              </h2>
            </div>
          </div>
        </section>

        {/* Stats Bar */}
        <section className="w-full py-16 border-y border-white/5">
          <div className="container px-6 md:px-12 max-w-7xl mx-auto">
            <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
              <div className="text-center space-y-2">
                <div className="text-3xl md:text-4xl font-extralight">10M+</div>
                <div className="text-sm font-light text-white/40 tracking-wider">DATA POINTS</div>
              </div>
              <div className="text-center space-y-2">
                <div className="text-3xl md:text-4xl font-extralight">99.9%</div>
                <div className="text-sm font-light text-white/40 tracking-wider">ACCURACY</div>
              </div>
              <div className="text-center space-y-2">
                <div className="text-3xl md:text-4xl font-extralight">150+</div>
                <div className="text-sm font-light text-white/40 tracking-wider">METRICS</div>
              </div>
              <div className="text-center space-y-2">
                <div className="text-3xl md:text-4xl font-extralight">24/7</div>
                <div className="text-sm font-light text-white/40 tracking-wider">LIVE UPDATES</div>
              </div>
            </div>
          </div>
        </section>

        {/* Features Section */}
        <section id="features" className="w-full py-24 md:py-32 relative">
          <div className="container px-6 md:px-12 max-w-7xl mx-auto">
            <div className="max-w-3xl mx-auto text-center mb-20">
              <h2 className="text-4xl md:text-6xl font-extralight tracking-[-0.02em] mb-6">
                PRECISION
                <br />
                <span className="text-white/40">ANALYTICS</span>
              </h2>
              <p className="text-lg font-light text-white/60 leading-relaxed">
                Every pitch, swing, and play analyzed with surgical precision.
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              <Card className="bg-white/[0.02] border-white/5 hover:border-white/10 transition-all duration-500 group">
                <CardContent className="p-8 space-y-6">
                  <div className="w-12 h-12 rounded-lg bg-white/5 flex items-center justify-center group-hover:bg-white/10 transition-colors duration-300">
                    <BarChart3 className="h-6 w-6 text-white/60" />
                  </div>
                  <div className="space-y-3">
                    <h3 className="text-xl font-light tracking-wider text-white">ADVANCED METRICS</h3>
                    <p className="text-white/50 font-light leading-relaxed">
                      Sabermetrics including xwOBA, Barrel%, and 150+ professional-grade statistics.
                    </p>
                  </div>
                </CardContent>
              </Card>

              <Card className="bg-white/[0.02] border-white/5 hover:border-white/10 transition-all duration-500 group">
                <CardContent className="p-8 space-y-6">
                  <div className="w-12 h-12 rounded-lg bg-white/5 flex items-center justify-center group-hover:bg-white/10 transition-colors duration-300">
                    <Zap className="h-6 w-6 text-white/60" />
                  </div>
                  <div className="space-y-3">
                    <h3 className="text-xl font-light tracking-wider text-white">REAL-TIME DATA</h3>
                    <p className="text-white/50 font-light leading-relaxed">
                      Pitch-by-pitch analysis with instant updates and live game projections.
                    </p>
                  </div>
                </CardContent>
              </Card>

              <Card className="bg-white/[0.02] border-white/5 hover:border-white/10 transition-all duration-500 group">
                <CardContent className="p-8 space-y-6">
                  <div className="w-12 h-12 rounded-lg bg-white/5 flex items-center justify-center group-hover:bg-white/10 transition-colors duration-300">
                    <TrendingUp className="h-6 w-6 text-white/60" />
                  </div>
                  <div className="space-y-3">
                    <h3 className="text-xl font-light tracking-wider text-white">PREDICTIVE AI</h3>
                    <p className="text-white/50 font-light leading-relaxed">
                      Machine learning algorithms that forecast performance and outcomes.
                    </p>
                  </div>
                </CardContent>
              </Card>

              <Card className="bg-white/[0.02] border-white/5 hover:border-white/10 transition-all duration-500 group">
                <CardContent className="p-8 space-y-6">
                  <div className="w-12 h-12 rounded-lg bg-white/5 flex items-center justify-center group-hover:bg-white/10 transition-colors duration-300">
                    <Users className="h-6 w-6 text-white/60" />
                  </div>
                  <div className="space-y-3">
                    <h3 className="text-xl font-light tracking-wider text-white">PLAYER COMPARISON</h3>
                    <p className="text-white/50 font-light leading-relaxed">
                      Advanced tools to evaluate players across different eras and contexts.
                    </p>
                  </div>
                </CardContent>
              </Card>

              <Card className="bg-white/[0.02] border-white/5 hover:border-white/10 transition-all duration-500 group">
                <CardContent className="p-8 space-y-6">
                  <div className="w-12 h-12 rounded-lg bg-white/5 flex items-center justify-center group-hover:bg-white/10 transition-colors duration-300">
                    <LineChart className="h-6 w-6 text-white/60" />
                  </div>
                  <div className="space-y-3">
                    <h3 className="text-xl font-light tracking-wider text-white">3D VISUALIZATION</h3>
                    <p className="text-white/50 font-light leading-relaxed">
                      Three-dimensional reconstructions of pitches, swings, and defensive positioning.
                    </p>
                  </div>
                </CardContent>
              </Card>

              <Card className="bg-white/[0.02] border-white/5 hover:border-white/10 transition-all duration-500 group">
                <CardContent className="p-8 space-y-6">
                  <div className="w-12 h-12 rounded-lg bg-white/5 flex items-center justify-center group-hover:bg-white/10 transition-colors duration-300">
                    <Trophy className="h-6 w-6 text-white/60" />
                  </div>
                  <div className="space-y-3">
                    <h3 className="text-xl font-light tracking-wider text-white">PRO SCOUTING</h3>
                    <p className="text-white/50 font-light leading-relaxed">
                      Professional-grade talent evaluation tools used by MLB organizations.
                    </p>
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>
        </section>

        {/* Analytics Showcase */}
        <section id="analytics" className="w-full py-24 md:py-32 relative">
          <div className="container px-6 md:px-12 max-w-7xl mx-auto">
            <div className="grid gap-16 lg:grid-cols-2 items-center">
              <div className="space-y-8">
                <div className="space-y-6">
                  <h2 className="text-4xl md:text-5xl font-extralight tracking-[-0.02em] leading-tight">
                    DATA THAT
                    <br />
                    <span className="text-white/40">TELLS STORIES</span>
                  </h2>
                  <p className="text-lg font-light text-white/60 leading-relaxed">
                    Our platform processes over 10 million data points per season, capturing every nuance from exit
                    velocity to spin rate with unprecedented accuracy.
                  </p>
                </div>

                <div className="space-y-6">
                  <div className="flex items-center gap-4 p-4 rounded-lg bg-white/[0.02] border border-white/5">
                    <div className="w-2 h-2 bg-green-400 rounded-full" />
                    <span className="font-light tracking-wider">PITCH TRACKING</span>
                  </div>
                  <div className="flex items-center gap-4 p-4 rounded-lg bg-white/[0.02] border border-white/5">
                    <div className="w-2 h-2 bg-blue-400 rounded-full" />
                    <span className="font-light tracking-wider">BATTED BALL ANALYSIS</span>
                  </div>
                  <div className="flex items-center gap-4 p-4 rounded-lg bg-white/[0.02] border border-white/5">
                    <div className="w-2 h-2 bg-purple-400 rounded-full" />
                    <span className="font-light tracking-wider">DEFENSIVE POSITIONING</span>
                  </div>
                </div>

                <Button className="bg-white text-black hover:bg-white/90 font-light tracking-wider px-8">
                  Explore Analytics
                  <ChevronRight className="h-4 w-4 ml-2" />
                </Button>
              </div>

              <div className="relative">
                <div className="absolute -inset-2 bg-gradient-to-r from-white/5 via-white/10 to-white/5 rounded-3xl blur-2xl" />
                <div className="relative bg-[#0a0a0a]/60 backdrop-blur-sm p-2 rounded-2xl border border-white/10">
                  <img
                    src="/placeholder.svg?height=500&width=600"
                    width={600}
                    height={500}
                    alt="Baseball Analytics Interface"
                    className="rounded-xl w-full opacity-90"
                  />
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Pricing Section */}
        <section id="pricing" className="w-full py-24 md:py-32 relative">
          <div className="container px-6 md:px-12 max-w-7xl mx-auto">
            <div className="max-w-3xl mx-auto text-center mb-20">
              <h2 className="text-4xl md:text-6xl font-extralight tracking-[-0.02em] mb-6 text-white">
                CHOOSE YOUR
                <br />
                <span className="text-white/40">LEVEL</span>
              </h2>
              <p className="text-lg font-light text-white/60 leading-relaxed mb-12">
                From casual fans to professional organizations.
              </p>

              <div className="flex items-center justify-center gap-4 mb-12">
                <span className={`text-sm font-light ${!isAnnual ? "text-white" : "text-white/40"}`}>MONTHLY</span>
                <div className="flex items-center">
                  <Switch
                    id="billing-toggle"
                    checked={isAnnual}
                    onCheckedChange={setIsAnnual}
                    className="data-[state=checked]:bg-white"
                  />
                </div>
                <span className={`text-sm font-light ${isAnnual ? "text-white" : "text-white/40"}`}>
                  ANNUAL <span className="text-green-400">(SAVE 20%)</span>
                </span>
              </div>
            </div>

            <div className="grid gap-8 lg:grid-cols-2 max-w-4xl mx-auto">
              <Card className="bg-white/[0.02] border-white/5 hover:border-white/10 transition-all duration-500 flex flex-col">
                <CardContent className="p-8 space-y-8 flex-1 flex flex-col">
                  <div className="space-y-4">
                    <h3 className="text-2xl font-light tracking-wider text-white">STARTER</h3>
                    <div className="space-y-2">
                      <div className="text-4xl font-extralight text-white">$0</div>
                      <div className="text-sm font-light text-white/40 tracking-wider">7-DAY FREE TRIAL</div>
                    </div>
                  </div>

                  <div className="space-y-4 flex-1">
                    <div className="flex items-center gap-3">
                      <div className="w-1.5 h-1.5 bg-white/60 rounded-full" />
                      <span className="font-light text-white/80">Basic statistics</span>
                    </div>
                    <div className="flex items-center gap-3">
                      <div className="w-1.5 h-1.5 bg-white/60 rounded-full" />
                      <span className="font-light text-white/80">Live scores</span>
                    </div>
                    <div className="flex items-center gap-3">
                      <div className="w-1.5 h-1.5 bg-white/60 rounded-full" />
                      <span className="font-light text-white/80">Limited access</span>
                    </div>
                  </div>

                  <Button
                    onClick={() => handlePlanSelect({ type: "starter", billing: "monthly" })}
                    variant="outline"
                    className="w-full border-white/20 hover:bg-white/5 font-light tracking-wider mt-auto"
                  >
                    Start 7-Day Trial
                  </Button>
                </CardContent>
              </Card>

              <Card className="bg-white/[0.02] border-white/10 relative scale-105 flex flex-col">
                <div className="absolute -top-4 left-1/2 transform -translate-x-1/2">
                  <Badge className="bg-white text-black font-light tracking-wider px-4 py-1">POPULAR</Badge>
                </div>
                <CardContent className="p-8 space-y-8 flex-1 flex flex-col">
                  <div className="space-y-4">
                    <h3 className="text-2xl font-light tracking-wider text-white">PREMIUM</h3>
                    <div className="space-y-2">
                      <div className="text-4xl font-extralight text-white">
                        {isAnnual ? "$29.99" : "$2.99"}
                        <span className="text-lg font-light text-white/40 ml-1">{isAnnual ? "/year" : "/month"}</span>
                      </div>
                      {isAnnual && (
                        <div className="text-xs font-light text-green-400 tracking-wider">SAVE $5.89 ANNUALLY</div>
                      )}
                    </div>
                  </div>

                  <div className="space-y-4 flex-1">
                    <div className="flex items-center gap-3">
                      <div className="w-1.5 h-1.5 bg-white rounded-full" />
                      <span className="font-light text-white/80">Advanced metrics</span>
                    </div>
                    <div className="flex items-center gap-3">
                      <div className="w-1.5 h-1.5 bg-white rounded-full" />
                      <span className="font-light text-white/80">3D visualizations</span>
                    </div>
                    <div className="flex items-center gap-3">
                      <div className="w-1.5 h-1.5 bg-white rounded-full" />
                      <span className="font-light text-white/80">Player comparisons</span>
                    </div>
                    <div className="flex items-center gap-3">
                      <div className="w-1.5 h-1.5 bg-white rounded-full" />
                      <span className="font-light text-white/80">Data export</span>
                    </div>
                    <div className="flex items-center gap-3">
                      <div className="w-1.5 h-1.5 bg-white rounded-full" />
                      <span className="font-light text-white/80">Priority support</span>
                    </div>
                  </div>

                  <Button
                    onClick={() => handlePlanSelect({ type: "premium", billing: isAnnual ? "annual" : "monthly" })}
                    className="w-full bg-white text-black hover:bg-white/90 font-light tracking-wider mt-auto"
                  >
                    Subscribe Now
                  </Button>
                </CardContent>
              </Card>
            </div>
          </div>
        </section>

        {/* CTA Section */}
        <section className="w-full py-24 md:py-32 relative">
          <div className="absolute inset-0 bg-gradient-to-t from-white/5 via-transparent to-transparent" />
          <div className="container px-6 md:px-12 max-w-7xl mx-auto relative">
            <div className="max-w-3xl mx-auto text-center space-y-12">
              <div className="space-y-6">
                <h2 className="text-4xl md:text-6xl font-extralight tracking-[-0.02em] leading-tight">
                  READY TO
                  <br />
                  <span className="text-white/40">ELEVATE</span>
                  <br />
                  YOUR GAME?
                </h2>
                <p className="text-lg font-light text-white/60 leading-relaxed">
                  Join thousands of analysts, scouts, and fans who have transformed their understanding of baseball.
                </p>
              </div>

              <div className="flex flex-col sm:flex-row gap-4 justify-center max-w-md mx-auto">
                <Input
                  type="email"
                  placeholder="Enter your email"
                  className="h-12 bg-white/5 border-white/10 text-white placeholder:text-white/40 font-light"
                />
                <Button
                  onClick={handleGetStarted}
                  className="h-12 px-8 bg-white text-black hover:bg-white/90 font-light tracking-wider"
                >
                  START FREE
                </Button>
              </div>

              <p className="text-xs font-light text-white/40 tracking-wider">
                7-DAY FREE TRIAL • NO CREDIT CARD REQUIRED
              </p>
            </div>
          </div>
        </section>
      </main>

      <footer className="py-16 w-full border-t border-white/5 relative">
        <div className="container px-6 md:px-12 max-w-7xl mx-auto">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-12">
            <button onClick={() => window.scrollTo(0, 0)} className="flex items-center gap-3">
              <div className="w-6 h-6 bg-white rounded-sm flex items-center justify-center">
                <Target className="h-4 w-4 text-black" />
              </div>
              <span className="font-light text-lg tracking-[0.2em]">BASEBALL STATS</span>
            </button>

            <div className="space-y-4">
              <h4 className="font-light tracking-wider text-white/60">PRODUCT</h4>
              <div className="space-y-3">
                <button
                  onClick={() => scrollToSection('features')}
                  className="block text-sm font-light text-white/40 hover:text-white transition-colors text-left"
                >
                  Features
                </button>
                <button
                  onClick={() => scrollToSection('pricing')}
                  className="block text-sm font-light text-white/40 hover:text-white transition-colors text-left"
                >
                  Pricing
                </button>
                <span className="block text-sm font-light text-white/40">API</span>
              </div>
            </div>

            <div className="space-y-4">
              <h4 className="font-light tracking-wider text-white/60">RESOURCES</h4>
              <div className="space-y-3">
                <span className="block text-sm font-light text-white/40">Documentation</span>
                <span className="block text-sm font-light text-white/40">Support</span>
                <span className="block text-sm font-light text-white/40">Blog</span>
              </div>
            </div>

            <div className="space-y-4">
              <h4 className="font-light tracking-wider text-white/60">COMPANY</h4>
              <div className="space-y-3">
                <span className="block text-sm font-light text-white/40">About</span>
                <span className="block text-sm font-light text-white/40">Contact</span>
                <span className="block text-sm font-light text-white/40">Privacy</span>
              </div>
            </div>
          </div>

          <div className="flex flex-col md:flex-row justify-between items-center mt-16 pt-8 border-t border-white/5">
            <p className="text-xs font-light text-white/30 tracking-wider">
              © 2024 BASEBALL STATS. ALL RIGHTS RESERVED.
            </p>
            <div className="flex gap-8 mt-4 md:mt-0">
              <span className="text-xs font-light text-white/30 tracking-wider cursor-pointer">TERMS</span>
              <span className="text-xs font-light text-white/30 tracking-wider cursor-pointer">PRIVACY</span>
            </div>
          </div>
        </div>
      </footer>

      {/* Modals */}
      <PlanSelectionModal
        isOpen={showPlanModal}
        onClose={() => setShowPlanModal(false)}
        onPlanSelect={handlePlanSelect}
      />

      <AuthModal
        isOpen={showAuthModal}
        onClose={() => setShowAuthModal(false)}
        selectedPlan={selectedPlan}
        onSuccess={handleAuthSuccess}
      />
    </div>
  )
}
