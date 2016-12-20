param(
	[Parameter(Position=0,Mandatory=0)]
	[string]$target
)

Import-Module .\Build\psake.4.6.0\tools\psake.psm1
Invoke-psake -buildFile .\Build\main.ps1 $target
