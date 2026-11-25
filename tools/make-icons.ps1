param([string]$Root)
Add-Type -AssemblyName System.Drawing

$assets = Join-Path $Root 'src\assets'
$out = Join-Path $Root 'public\icons'

# path => source image, background ('' = sample from image corner)
$tenants = @(
  # Salva Lucro: logo azul (486px) recolorido no verde do ICON_LOGO_VERDE (que só tem 236px).
  @{ path = 'salvalucro3';       src = 'user_icons\ICON_LOGO_AZUL.png';    bg = '#FFFFFF'; recolor = '#99CC33' },
  @{ path = 'sifra_react';       src = 'user_icons\ICON_SIFRA.png';        bg = '#FFFFFF' },
  @{ path = 'mg_react';          src = 'logoMG.png';                       bg = '' },
  @{ path = 'superjur_react';    src = 'user_icons\ICON_SUPERJUR.png';     bg = '#FFFFFF' },
  @{ path = 'carddigital_react'; src = 'user_icons\ICON_CARD_DIGITAL.png'; bg = '#FFFFFF' }
)

function Get-ContentBounds($bmp) {
  # Bounding box of non-transparent pixels (ignores padding baked into the source).
  $minX = $bmp.Width; $minY = $bmp.Height; $maxX = -1; $maxY = -1
  for ($y = 0; $y -lt $bmp.Height; $y++) {
    for ($x = 0; $x -lt $bmp.Width; $x++) {
      if ($bmp.GetPixel($x, $y).A -gt 16) {
        if ($x -lt $minX) { $minX = $x }; if ($x -gt $maxX) { $maxX = $x }
        if ($y -lt $minY) { $minY = $y }; if ($y -gt $maxY) { $maxY = $y }
      }
    }
  }
  if ($maxX -lt 0) { return New-Object System.Drawing.Rectangle 0, 0, $bmp.Width, $bmp.Height }
  return New-Object System.Drawing.Rectangle $minX, $minY, ($maxX - $minX + 1), ($maxY - $minY + 1)
}

function New-Icon($src, $crop, $size, $padding, $bgColor, $file) {
  $bmp = New-Object System.Drawing.Bitmap $size, $size
  $g = [System.Drawing.Graphics]::FromImage($bmp)
  $g.InterpolationMode = [System.Drawing.Drawing2D.InterpolationMode]::HighQualityBicubic
  $g.SmoothingMode = [System.Drawing.Drawing2D.SmoothingMode]::HighQuality
  $g.PixelOffsetMode = [System.Drawing.Drawing2D.PixelOffsetMode]::HighQuality
  $g.CompositingQuality = [System.Drawing.Drawing2D.CompositingQuality]::HighQuality
  if ($bgColor) { $g.Clear($bgColor) } else { $g.Clear([System.Drawing.Color]::Transparent) }

  $avail = $size * (1 - 2 * $padding)
  $scale = [Math]::Min($avail / $crop.Width, $avail / $crop.Height)
  $w = $crop.Width * $scale; $h = $crop.Height * $scale
  $dest = New-Object System.Drawing.RectangleF (($size - $w) / 2), (($size - $h) / 2), $w, $h
  $attrs = New-Object System.Drawing.Imaging.ImageAttributes
  $attrs.SetWrapMode([System.Drawing.Drawing2D.WrapMode]::TileFlipXY)
  $g.DrawImage($src, [System.Drawing.Rectangle]::Round($dest), $crop.X, $crop.Y, $crop.Width, $crop.Height, [System.Drawing.GraphicsUnit]::Pixel, $attrs)
  $g.Dispose()
  $bmp.Save($file, [System.Drawing.Imaging.ImageFormat]::Png)
  $bmp.Dispose()
}

foreach ($t in $tenants) {
  $dir = Join-Path $out $t.path
  New-Item -ItemType Directory -Force $dir | Out-Null
  $src = New-Object System.Drawing.Bitmap (Join-Path $assets $t.src)

  if ($t.recolor) {
    # Troca a cor principal mantendo branco e transparência (pixels claros continuam claros).
    $to = [System.Drawing.ColorTranslator]::FromHtml($t.recolor)
    $baseL = 255
    for ($y = 0; $y -lt $src.Height; $y += 3) {
      for ($x = 0; $x -lt $src.Width; $x += 3) {
        $p = $src.GetPixel($x, $y)
        if ($p.A -eq 255) { $baseL = [Math]::Min($baseL, ($p.R + $p.G + $p.B) / 3) }
      }
    }
    for ($y = 0; $y -lt $src.Height; $y++) {
      for ($x = 0; $x -lt $src.Width; $x++) {
        $p = $src.GetPixel($x, $y)
        if ($p.A -eq 0) { continue }
        $l = ($p.R + $p.G + $p.B) / 3
        $s = [Math]::Max(0, [Math]::Min(1, ($l - $baseL) / (255 - $baseL)))
        $r = [int]($to.R + (255 - $to.R) * $s); $g = [int]($to.G + (255 - $to.G) * $s); $b = [int]($to.B + (255 - $to.B) * $s)
        $src.SetPixel($x, $y, [System.Drawing.Color]::FromArgb($p.A, $r, $g, $b))
      }
    }
  }

  if ($t.bg) {
    $bg = [System.Drawing.ColorTranslator]::FromHtml($t.bg)
    $crop = Get-ContentBounds $src
  } else {
    # Imagem com fundo em degradê (MG): extrai o texto branco para um PNG transparente
    # e aplica sobre uma cor de fundo uniforme, sem a borda do retângulo original.
    $bg = $src.GetPixel([int]($src.Width / 2), 10)
    $bgL = ($bg.R + $bg.G + $bg.B) / 3
    $glyphs = New-Object System.Drawing.Bitmap $src.Width, $src.Height
    for ($y = 0; $y -lt $src.Height; $y++) {
      for ($x = 0; $x -lt $src.Width; $x++) {
        $p = $src.GetPixel($x, $y)
        $l = ($p.R + $p.G + $p.B) / 3
        $a = [int][Math]::Max(0, [Math]::Min(255, (($l - $bgL - 20) / (255 - $bgL - 20)) * 255))
        if ($a -gt 0) { $glyphs.SetPixel($x, $y, [System.Drawing.Color]::FromArgb($a, 255, 255, 255)) }
      }
    }
    $src.Dispose()
    $src = $glyphs
    $crop = Get-ContentBounds $src
  }

  New-Icon $src $crop 192 0.10 $bg (Join-Path $dir 'icon-192.png')
  New-Icon $src $crop 512 0.10 $bg (Join-Path $dir 'icon-512.png')
  # Maskable: o Android recorta em círculo, então o conteúdo fica na zona segura (80% central).
  New-Icon $src $crop 512 0.20 $bg (Join-Path $dir 'maskable-512.png')
  New-Icon $src $crop 180 0.10 $bg (Join-Path $dir 'apple-touch-icon.png')
  # Aba do navegador: fundo transparente quando a marca permite.
  $favBg = if ($t.bg) { $null } else { $bg }
  New-Icon $src $crop 64 0.02 $favBg (Join-Path $dir 'favicon-64.png')

  $src.Dispose()
  Write-Output "$($t.path): ok (crop $($crop.Width)x$($crop.Height))"
}
