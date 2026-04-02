(async () => {
  try {
    // 1) Analyze activity
    const activityAnalyzer = new TokenActivityAnalyzer("https://solana.rpc")
    const records = await activityAnalyzer.analyzeActivity("MintPubkeyHere", 20)

    // 2) Analyze depth
    const depthAnalyzer = new TokenDepthAnalyzer("https://dex.api", "MarketPubkeyHere")
    const depthMetrics = await depthAnalyzer.analyze(30)

    // 3) Detect patterns (guard against bad/empty amounts)
    const volumes = records.map(r => Number(r.amount)).filter(Number.isFinite)
    const windowSize = 5
    const threshold = 100
    const patterns = volumes.length >= windowSize ? detectVolumePatterns(volumes, windowSize, threshold) : []

    // 4) Execute a custom task
    const engine = new ExecutionEngine()
    engine.register("report", async (params) => ({ records: Array.isArray(params.records) ? params.records.length : 0 }))
    engine.enqueue("task1", "report", { records })
    const taskResults = await engine.runAll()

    // 5) Sign the results
    const signer = new SigningEngine()
    const payload = JSON.stringify({ depthMetrics, patterns, taskResults })
    const signature = await signer.sign(payload)
    const signatureValid = await signer.verify(payload, signature)

    console.log({ records, depthMetrics, patterns, taskResults, signatureValid })
  } catch (err: any) {
    console.error("Pipeline failed:", err?.message ?? err)
  }
})()
