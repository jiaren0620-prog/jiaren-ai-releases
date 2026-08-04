$ErrorActionPreference = 'Stop'

$root = Resolve-Path (Join-Path $PSScriptRoot '..')
$executable = Join-Path $root 'release-v113\win-unpacked\Jiaren AI.exe'
if (-not (Test-Path $executable)) {
  throw "Protected runtime executable is missing: $executable"
}

$testRoot = Join-Path $root ('build\qa-protected-runtime-auth-' + [guid]::NewGuid().ToString('N'))
New-Item -ItemType Directory -Force -Path $testRoot | Out-Null
$stdout = Join-Path $testRoot 'stdout.log'
$stderr = Join-Path $testRoot 'stderr.log'
$userDataArgument = '--user-data-dir="' + $testRoot + '"'
$process = Start-Process -FilePath $executable `
  -WorkingDirectory (Split-Path $executable) `
  -ArgumentList @($userDataArgument, '--enable-logging') `
  -RedirectStandardOutput $stdout `
  -RedirectStandardError $stderr `
  -PassThru

try {
  Start-Sleep -Seconds 10
  $startupLog = Join-Path $testRoot '.jiaren\startup.log'
  $startupText = if (Test-Path $startupLog) { Get-Content $startupLog -Raw -Encoding utf8 } else { '' }
  $stderrText = if (Test-Path $stderr) { Get-Content $stderr -Raw -Encoding utf8 } else { '' }
  $portMatch = [regex]::Match($startupText, 'jiaren-local-service ready http://127\.0\.0\.1:(\d+)')
  $unauthenticatedStatus = $null
  if ($portMatch.Success) {
    try {
      $response = Invoke-WebRequest -UseBasicParsing -Uri ('http://127.0.0.1:' + $portMatch.Groups[1].Value + '/api/status')
      $unauthenticatedStatus = [int]$response.StatusCode
    } catch {
      $unauthenticatedStatus = [int]$_.Exception.Response.StatusCode
    }
  }

  $result = [ordered]@{
    appAlive = -not $process.HasExited
    rendererLoaded = $startupText -match 'renderer-http='
    frontendInAsar = $startupText -match 'frontend=.*app\.asar\\dist'
    unauthenticatedStatus = $unauthenticatedStatus
    sharpUnavailable = $stderrText -match 'sharp unavailable'
    testRoot = $testRoot
  }
  $result | ConvertTo-Json -Compress

  if (-not $result.appAlive) { throw 'Protected runtime exited during startup.' }
  if (-not $result.rendererLoaded) { throw 'Protected renderer did not load.' }
  if (-not $result.frontendInAsar) { throw 'Frontend was not served from app.asar.' }
  if ($result.unauthenticatedStatus -ne 401) { throw "Unauthenticated local service returned $($result.unauthenticatedStatus), expected 401." }
  if ($result.sharpUnavailable) { throw 'Sharp was unavailable in the protected runtime.' }
} finally {
  $related = Get-CimInstance Win32_Process | Where-Object {
    $_.ExecutablePath -and $_.ExecutablePath.StartsWith((Split-Path $executable), [StringComparison]::OrdinalIgnoreCase)
  }
  foreach ($item in $related) {
    Stop-Process -Id $item.ProcessId -Force -ErrorAction SilentlyContinue
  }
}
