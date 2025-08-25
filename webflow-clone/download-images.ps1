# Download key images for Flow Party course page

$images = @(
    @{ url = "https://cdn.prod.website-files.com/63bf3e1c32ea7ba16d1bdf88/63c47e9a2c404bf3010995e1_icon-lg%20(2).jpg"; file = "assets/images/icon-lg-2.jpg" },
    @{ url = "https://cdn.prod.website-files.com/63bf3e1c32ea7ba16d1bdf88/63c47e43d3e27e80e1aac8b8_icon-sm%20(5).jpg"; file = "assets/images/icon-sm-5.jpg" },
    @{ url = "https://cdn.prod.website-files.com/63bf3e1c32ea7ba16d1bdf88/64a6f188e274433966f754cc_DiscordLogo.svg"; file = "assets/images/DiscordLogo.svg" },
    @{ url = "https://cdn.prod.website-files.com/63bf3e1c32ea7ba16d1bdf88/63bf3e1c32ea7b71281bdfba_Instagram.svg"; file = "assets/images/Instagram.svg" },
    @{ url = "https://cdn.prod.website-files.com/63bf3e1c32ea7ba16d1bdf88/63bf3e1c32ea7b86821bdfbc_Twitter.svg"; file = "assets/images/Twitter.svg" },
    @{ url = "https://cdn.prod.website-files.com/63bf3e1c32ea7ba16d1bdf88/63bf3e1c32ea7b44fb1bdfbd_YouTube.svg"; file = "assets/images/YouTube.svg" },
    @{ url = "https://cdn.prod.website-files.com/63bf3e1c32ea7ba16d1bdf88/63bf3e1c32ea7b76861bdfb5_menu%20(2).svg"; file = "assets/images/menu-2.svg" },
    @{ url = "https://cdn.prod.website-files.com/63bf3e1c32ea7ba16d1bdf88/64286f0926a472c19eaadd66_OnDemand-Badge.svg"; file = "assets/images/OnDemand-Badge.svg" },
    @{ url = "https://cdn.prod.website-files.com/63bf3e1c32ea7ba16d1bdf88/63cadfad4d157050f145bc3d_Flow%20Party%20-%20All%20Caps%20-%20Horizontal%20Lockup.svg"; file = "assets/images/Flow-Party-Logo.svg" },
    @{ url = "https://cdn.prod.website-files.com/63bf3e1c32ea7ba16d1bdf88/65baee591c3d847be314deac_Come-Final-1920-1.jpg"; file = "assets/images/Come-Final-1920-1.jpg" },
    @{ url = "https://cdn.prod.website-files.com/63bf3e1c32ea7ba16d1bdf88/653ae2101c77bee5ab7d8993_Joseph.jpg"; file = "assets/images/Joseph.jpg" },
    @{ url = "https://cdn.prod.website-files.com/63bf3e1c32ea7ba16d1bdf88/654173d6a1699b585847cc81_diego%20(1).jpg"; file = "assets/images/diego-1.jpg" },
    @{ url = "https://cdn.prod.website-files.com/63bf3e1c32ea7ba16d1bdf88/654bf80b50c5b56712561083_Jomor%20(2)%20(1).jpg"; file = "assets/images/Jomor-2-1.jpg" },
    @{ url = "https://cdn.prod.website-files.com/63bf3e1c32ea7ba16d1bdf88/654bf8d42977c6df5289cd61_Ilja%20(3)%20(1).jpg"; file = "assets/images/Ilja-3-1.jpg" },
    @{ url = "https://cdn.prod.website-files.com/63bf3e1c32ea7ba16d1bdf88/654c0acc6020ac0fde4cb016_Joseph-Card.png"; file = "assets/images/Joseph-Card.png" },
    @{ url = "https://cdn.prod.website-files.com/63bf3e1c32ea7ba16d1bdf88/654c0acc30094b69189ee8d2_Diego-Card.png"; file = "assets/images/Diego-Card.png" },
    @{ url = "https://cdn.prod.website-files.com/63bf3e1c32ea7ba16d1bdf88/654c0acc56544ba1405c3691_jomo-Card.png"; file = "assets/images/jomo-Card.png" },
    @{ url = "https://cdn.prod.website-files.com/63bf3e1c32ea7ba16d1bdf88/654c0acc3d02c6310efe4855_jlja-Card.png"; file = "assets/images/jlja-Card.png" },
    @{ url = "https://cdn.prod.website-files.com/63bf3e1c32ea7ba16d1bdf88/65947a82bc2c1d811da22f45_Group%20124.svg"; file = "assets/images/Group-124.svg" }
)

$lotties = @(
    @{ url = "https://cdn.prod.website-files.com/63bf3e1c32ea7ba16d1bdf88/63bf3e1c32ea7b91831bdfb6_marker_line_lottie.json"; file = "assets/js/marker_line_lottie.json" }
)

Write-Host "Downloading images..."
foreach ($img in $images) {
    try {
        Write-Host "Downloading $($img.file)..."
        Invoke-WebRequest -Uri $img.url -OutFile $img.file -ErrorAction Stop
        Write-Host "✓ Downloaded $($img.file)"
    } catch {
        Write-Host "✗ Failed to download $($img.file): $_"
    }
}

Write-Host "Downloading Lottie files..."
foreach ($lottie in $lotties) {
    try {
        Write-Host "Downloading $($lottie.file)..."
        Invoke-WebRequest -Uri $lottie.url -OutFile $lottie.file -ErrorAction Stop
        Write-Host "✓ Downloaded $($lottie.file)"
    } catch {
        Write-Host "✗ Failed to download $($lottie.file): $_"
    }
}

Write-Host "Download complete!"
