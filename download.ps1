$url = "https://slelguoygbfzlpylpxfs.supabase.co/storage/v1/render/image/public/project-uploads/beb49228-4a99-4310-a910-e58e1a27f2a6/Gemini_Generated_Image_ojq8a9ojq8a9ojq8-resized-1770381775317.webp?width=8000&height=8000&resize=contain"
$out = "C:/Users/patra/orchids-projects/cloud-kitchen-menu/public/thank-you-chef.webp"
(New-Object System.Net.WebClient).DownloadFile($url, $out)
Write-Host (Get-Item $out).Length
