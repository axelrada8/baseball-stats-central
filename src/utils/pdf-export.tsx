
export function generatePDF(stats: any, language: "en" | "es") {
  const translations = {
    en: {
      title: "BASEBALL PLAYER STATISTICS REPORT",
      playerInfo: "PLAYER INFORMATION",
      offensiveStats: "OFFENSIVE STATISTICS",
      advancedMetrics: "ADVANCED METRICS",
      name: "Name",
      position: "Position",
      team: "Team",
      games: "Games (G)",
      atBats: "At Bats (AB)",
      runs: "Runs (R)",
      hits: "Hits (H)",
      doubles: "Doubles (2B)",
      triples: "Triples (3B)",
      homeRuns: "Home Runs (HR)",
      rbi: "RBI",
      stolenBases: "Stolen Bases (SB)",
      caughtStealing: "Caught Stealing (CS)",
      walks: "Walks (BB)",
      strikeouts: "Strikeouts (K)",
      battingAverage: "Batting Average (AVG)",
      onBasePercentage: "On-Base Percentage (OBP)",
      sluggingPercentage: "Slugging Percentage (SLG)",
      ops: "OPS",
    },
    es: {
      title: "REPORTE DE ESTADÍSTICAS DE JUGADOR DE BÉISBOL",
      playerInfo: "INFORMACIÓN DEL JUGADOR",
      offensiveStats: "ESTADÍSTICAS OFENSIVAS",
      advancedMetrics: "MÉTRICAS AVANZADAS",
      name: "Nombre",
      position: "Posición",
      team: "Equipo",
      games: "Juegos (J)",
      atBats: "Turnos al Bate (TB)",
      runs: "Carreras (C)",
      hits: "Hits (H)",
      doubles: "Dobles (2B)",
      triples: "Triples (3B)",
      homeRuns: "Jonrones (HR)",
      rbi: "Carreras Impulsadas (CI)",
      stolenBases: "Bases Robadas (BR)",
      caughtStealing: "Atrapado Robando (AR)",
      walks: "Bases por Bolas (BB)",
      strikeouts: "Ponches (K)",
      battingAverage: "Promedio de Bateo (AVG)",
      onBasePercentage: "Porcentaje en Base (OBP)",
      sluggingPercentage: "Porcentaje de Slugging (SLG)",
      ops: "OPS",
    },
  }

  const t = translations[language]

  // Create a new window for the PDF
  const printWindow = window.open("", "_blank")
  if (!printWindow) return

  const html = `
    <!DOCTYPE html>
    <html>
    <head>
      <title>${t.title}</title>
      <style>
        body {
          font-family: 'Arial', sans-serif;
          margin: 40px;
          background: white;
          color: black;
        }
        .header {
          text-align: center;
          border-bottom: 3px solid #000;
          padding-bottom: 20px;
          margin-bottom: 30px;
        }
        .title {
          font-size: 24px;
          font-weight: bold;
          letter-spacing: 2px;
          margin-bottom: 10px;
        }
        .section {
          margin-bottom: 30px;
          border: 2px solid #000;
          padding: 20px;
        }
        .section-title {
          font-size: 18px;
          font-weight: bold;
          letter-spacing: 1px;
          margin-bottom: 15px;
          text-align: center;
          border-bottom: 1px solid #000;
          padding-bottom: 10px;
        }
        .stats-grid {
          display: grid;
          grid-template-columns: 1fr 1fr;
          gap: 15px;
        }
        .stat-row {
          display: flex;
          justify-content: space-between;
          padding: 8px 0;
          border-bottom: 1px dotted #ccc;
        }
        .stat-label {
          font-weight: bold;
        }
        .stat-value {
          font-family: monospace;
          font-size: 14px;
        }
        .line {
          border-bottom: 1px solid #000;
          margin: 10px 0;
        }
        @media print {
          body { margin: 20px; }
        }
      </style>
    </head>
    <body>
      <div class="header">
        <div class="title">${t.title}</div>
        <div class="line"></div>
      </div>

      <div class="section">
        <div class="section-title">${t.playerInfo}</div>
        <div class="stats-grid">
          <div class="stat-row">
            <span class="stat-label">${t.name}:</span>
            <span class="stat-value">${stats.name || "—"}</span>
          </div>
          <div class="stat-row">
            <span class="stat-label">${t.position}:</span>
            <span class="stat-value">${stats.position || "—"}</span>
          </div>
          <div class="stat-row">
            <span class="stat-label">${t.team}:</span>
            <span class="stat-value">${stats.team || "—"}</span>
          </div>
        </div>
      </div>

      <div class="section">
        <div class="section-title">${t.offensiveStats}</div>
        <div class="stats-grid">
          <div class="stat-row">
            <span class="stat-label">${t.games}:</span>
            <span class="stat-value">${stats.games}</span>
          </div>
          <div class="stat-row">
            <span class="stat-label">${t.atBats}:</span>
            <span class="stat-value">${stats.atBats}</span>
          </div>
          <div class="stat-row">
            <span class="stat-label">${t.runs}:</span>
            <span class="stat-value">${stats.runs}</span>
          </div>
          <div class="stat-row">
            <span class="stat-label">${t.hits}:</span>
            <span class="stat-value">${stats.hits}</span>
          </div>
          <div class="stat-row">
            <span class="stat-label">${t.doubles}:</span>
            <span class="stat-value">${stats.doubles}</span>
          </div>
          <div class="stat-row">
            <span class="stat-label">${t.triples}:</span>
            <span class="stat-value">${stats.triples}</span>
          </div>
          <div class="stat-row">
            <span class="stat-label">${t.homeRuns}:</span>
            <span class="stat-value">${stats.homeRuns}</span>
          </div>
          <div class="stat-row">
            <span class="stat-label">${t.rbi}:</span>
            <span class="stat-value">${stats.rbi}</span>
          </div>
          <div class="stat-row">
            <span class="stat-label">${t.stolenBases}:</span>
            <span class="stat-value">${stats.stolenBases}</span>
          </div>
          <div class="stat-row">
            <span class="stat-label">${t.caughtStealing}:</span>
            <span class="stat-value">${stats.caughtStealing}</span>
          </div>
          <div class="stat-row">
            <span class="stat-label">${t.walks}:</span>
            <span class="stat-value">${stats.walks}</span>
          </div>
          <div class="stat-row">
            <span class="stat-label">${t.strikeouts}:</span>
            <span class="stat-value">${stats.strikeouts}</span>
          </div>
        </div>
      </div>

      <div class="section">
        <div class="section-title">${t.advancedMetrics}</div>
        <div class="stats-grid">
          <div class="stat-row">
            <span class="stat-label">${t.battingAverage}:</span>
            <span class="stat-value">${stats.battingAverage.toFixed(3)}</span>
          </div>
          <div class="stat-row">
            <span class="stat-label">${t.onBasePercentage}:</span>
            <span class="stat-value">${stats.onBasePercentage.toFixed(3)}</span>
          </div>
          <div class="stat-row">
            <span class="stat-label">${t.sluggingPercentage}:</span>
            <span class="stat-value">${stats.sluggingPercentage.toFixed(3)}</span>
          </div>
          <div class="stat-row">
            <span class="stat-label">${t.ops}:</span>
            <span class="stat-value">${stats.ops.toFixed(3)}</span>
          </div>
        </div>
      </div>

      <div style="margin-top: 40px; text-align: center; font-size: 12px; color: #666;">
        Generated by Baseball Stats - ${new Date().toLocaleDateString()}
      </div>
    </body>
    </html>
  `

  printWindow.document.write(html)
  printWindow.document.close()

  // Wait for content to load then print
  setTimeout(() => {
    printWindow.print()
  }, 500)
}
