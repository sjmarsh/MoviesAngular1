

Task Test {
  #TODO add some tests
}

Task Dev -depends Test {
  cd ..\MoviesAngular1
  Get-Location
  gulp
  cd ..
  Get-Location
}

Task Publish {
 .\aws-publish.ps1 "movies-angular1" ".\..\MoviesAngular1\dist" "dist"
}

Task default -depends Dev