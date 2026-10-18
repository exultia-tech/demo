Add-Type -AssemblyName System.Drawing
Add-Type -Path "C:\Users\angrysquare\.gemini\antigravity-ide\scratch\demo\scripts\LogoProcessor.cs" -ReferencedAssemblies "System.Drawing.dll"

$srcPath = "C:\Users\angrysquare\.gemini\antigravity-ide\brain\fd15cf86-7c56-4f86-9a69-eefcf85b93be\.user_uploaded\media_1792357467010.jpg"
$src = [System.Drawing.Bitmap]::FromFile($srcPath)

$demoAssets = "C:\Users\angrysquare\.gemini\antigravity-ide\scratch\demo\assets"
if (!(Test-Path $demoAssets)) { New-Item -ItemType Directory -Path $demoAssets -Force | Out-Null }
$webBranding = "C:\Users\angrysquare\.gemini\antigravity-ide\scratch\secure-ide-web\public\branding"
$webPublic = "C:\Users\angrysquare\.gemini\antigravity-ide\scratch\secure-ide-web\public"

# 1. Cyan (Original)
Write-Host "Processing Cyan..."
$cyan = [LogoProcessor]::Process($src, $null)
$cyan.Save("$demoAssets\logo.png", [System.Drawing.Imaging.ImageFormat]::Png)
$cyan.Save("$demoAssets\exultia-logo.png", [System.Drawing.Imaging.ImageFormat]::Png)
$cyan.Save("$webBranding\logo.png", [System.Drawing.Imaging.ImageFormat]::Png)
$cyan.Save("$webBranding\exultia-logo.png", [System.Drawing.Imaging.ImageFormat]::Png)
$cyan.Save("$webBranding\emblem_cyan.png", [System.Drawing.Imaging.ImageFormat]::Png)

# Icon 64x64
$icon = New-Object System.Drawing.Bitmap($cyan, 64, 64)
$icon.Save("$webPublic\icon.png", [System.Drawing.Imaging.ImageFormat]::Png)
$icon.Dispose()

# 2. Orange (Hue = 0.07)
Write-Host "Processing Orange..."
$orange = [LogoProcessor]::Process($src, 0.07)
$orange.Save("$webBranding\emblem_orange.png", [System.Drawing.Imaging.ImageFormat]::Png)
$orange.Dispose()

# 3. Green (Hue = 0.38)
Write-Host "Processing Green..."
$green = [LogoProcessor]::Process($src, 0.38)
$green.Save("$webBranding\emblem_green.png", [System.Drawing.Imaging.ImageFormat]::Png)
$green.Dispose()

# 4. Magenta (Hue = 0.88)
Write-Host "Processing Magenta..."
$magenta = [LogoProcessor]::Process($src, 0.88)
$magenta.Save("$webBranding\emblem_magenta.png", [System.Drawing.Imaging.ImageFormat]::Png)
$magenta.Dispose()

$cyan.Dispose()
$src.Dispose()
Write-Host "Successfully generated all high-resolution logo assets!"
