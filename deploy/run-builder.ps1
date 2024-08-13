$name = "frontend"
$directory = ".\" + "$name"
$Dockerfile = "$directory" + "\Dockerfile"
$imageName = "$name" + "-build"
$volumeName = "$name" + "-dist"
$distDirectory = "/" + "$name" + "/dist"
$volumeOption = $volumeName + ":" + $distDirectory

Copy-Item .env -Destination .\frontend
docker build -f $Dockerfile -t $imageName $directory
docker run -v $volumeOption -t $imageName
Remove-Item .\frontend\.env
