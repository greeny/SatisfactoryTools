# umodel / UE Viwer

UE Viewer (AKA umodel) is an Unreal Engine PAK utility that this project uses to extract the images from Satisfactory's game files.

See 

There are 2 pre-compiled binaries included in the repo:
- `linux/umodel` - Ubuntu 20.04 (amd64)
- `win64/uemodel_64.exe` - Windows 64-bit executable


## Building
NhOQJJp2l1tIFzhzvFi6
1. Clone https://github.com/gildor2/UEViewer
2. Run build.sh

## Troubleshooting build errors

### `./libs/oodle/lib/Linux/liboo2corelinux64.a doesn't exist`


Pay attention to any missing components and install them. They are generally available via `apt install`. Google the missing component to figure it out.