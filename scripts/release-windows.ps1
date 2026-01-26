param(
  [string]$Platform = "windows/amd64",
  [string]$Tags = "webkit2_41"
)

$RootDir = Split-Path -Parent $MyInvocation.MyCommand.Path
$RootDir = Split-Path -Parent $RootDir
$ReleaseDir = Join-Path $RootDir "release"

function Require-Command {
  param([string]$Name)
  if (-not (Get-Command $Name -ErrorAction SilentlyContinue)) {
    Write-Error "Missing required command: $Name"
    exit 1
  }
}

New-Item -ItemType Directory -Force -Path $ReleaseDir | Out-Null

Require-Command "wails"
Require-Command "makensis"

$OutputName = "kebac-" + $Platform.Replace("/", "-")

Write-Host "Building $Platform -> $OutputName"
wails build -clean -platform $Platform -tags $Tags -o $OutputName -nsis

$installerExe = Get-ChildItem -Path (Join-Path $RootDir "build/bin") -Filter "*installer*.exe" -ErrorAction SilentlyContinue
$installerMsi = Get-ChildItem -Path (Join-Path $RootDir "build/bin") -Filter "*.msi" -ErrorAction SilentlyContinue
$installers = @()
$installers += $installerExe
$installers += $installerMsi

if ($installers.Count -gt 0) {
  $installers | ForEach-Object {
    Copy-Item -Path $_.FullName -Destination $ReleaseDir -Force
  }
} else {
  Write-Host "No Windows installer artifacts found in build/bin."
}

Write-Host "Release artifacts are in $ReleaseDir"
