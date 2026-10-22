$ErrorActionPreference = 'Stop'
$rootDir = (Get-Location).Path
$stagingDir = Join-Path $rootDir 'temp_clean_source'

if (Test-Path $stagingDir) {
    Remove-Item -Recurse -Force $stagingDir
}
New-Item -ItemType Directory -Path $stagingDir | Out-Null

Write-Host "Copying src and assets..."
Copy-Item -Recurse -Path 'src', 'assets' -Destination $stagingDir

Write-Host "Copying root config files..."
Copy-Item 'package.json', 'package-lock.json', 'app.json', 'tsconfig.json', 'eslint.config.js', 'expo-env.d.ts', 'README.md', 'AGENTS.md', 'README-RELEASE.txt' -Destination $stagingDir

Write-Host "Copying release APK..."
Copy-Item 'EduPulse-SchoolApp-v1.0.0-release.apk' -Destination $stagingDir

Write-Host "Compressing to EduPulse-SchoolApp-Complete.zip..."
$destinationZip = Join-Path $rootDir 'EduPulse-SchoolApp-Complete.zip'
if (Test-Path $destinationZip) {
    Remove-Item -Force $destinationZip
}
Compress-Archive -Path "$stagingDir\*" -DestinationPath $destinationZip -Force

Write-Host "Cleaning up staging directory..."
Remove-Item -Recurse -Force $stagingDir

Write-Host "Zip creation complete: $destinationZip"
