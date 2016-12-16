$bucketName = "movies-angular1"
$distFolder = "dist"
$distFiles = Get-ChildItem .\$distFolder -Recurse -Include *.*

Write-Host ""
Write-Host "-----------------------"
Write-Host "Publish files to AWS S3" -foregroundcolor Green
Write-Host "-----------------------"
Write-Host ""
Write-Host "Publishing files from folder: $distFolder to aws bucket: $bucketName"
Write-Host ""

foreach ($path in $distFiles) {
	Write-Host "Working on File:"
  Write-Host $path
  
  $filename = [System.IO.Path]::GetFileName($path)
  $splitPath = $path.ToString() -split $distFolder
  $subPath = $splitPath[1].TrimStart("\\")
  $keyName = $subPath

	Write-S3Object -BucketName $bucketName -File $path -Key $keyName -CannedACLName public-read
}

Write-Host ""
Write-Host "Done."
Write-Host ""