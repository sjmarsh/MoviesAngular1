param(
	[Parameter(Position=0,Mandatory=1)]
	[string]$bucketName,
  [Parameter(Position=1,Mandatory=1)]
  [string]$distFolder,
  [Parameter(Position=2,Mandatory=1)]
  [string]$distFolderName
)

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

  #get keyName (=containing folder name + file name, eg. css\styles.min.css)
  $splitPath = $path.ToString() -split $distFolderName
  $subPath = $splitPath[1].TrimStart("\\")
  $keyName = $subPath
  #Write-Host keyName: $KeyName

	Write-S3Object -BucketName $bucketName -File $path -Key $keyName -CannedACLName public-read
}

Write-Host ""
Write-Host "Done."
Write-Host ""