$name = "frontend"
$directory = ".\" + "$name"
$Dockerfile = "$directory" + "\Dockerfile"
$imageName = "$name" + "-build"
$volumeName = "$name" + "-dist"
$distDirectory = "/" + "$name" + "/dist"
$volumeOption = $volumeName + ":" + $distDirectory

docker build -f $Dockerfile -t $imageName $directory
docker run -v $volumeOption -v ".\.env:/.env" -t $imageName
