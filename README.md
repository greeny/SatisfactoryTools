# SatisfactoryTools
Satisfactory Tools for planning and building the perfect base.

## Requirements
- node.js
- yarn
- PHP 7.1+

## Installation
- `git clone git@github.com:greeny/SatisfactoryTools.git`
- `yarn install`
- Set up a virtual host pointing to `/www` directory (using e.g. Apache or ngnix)

## Contributing
Any pull requests are welcome, though some rules must be followed:
- try to follow current coding style (there's `tslint` and `.editorconfig`, those should help you with that)
- one PR per feature
- all PRs must target `dev` branch

## Development
Run `yarn start` to start the automated build process. It will watch over the code and rebuild it on change.

## Updating data
Get the latest Docs.json from your game installation and place it into `data` folder.
Then run `yarn parseDocs`command and the `data.json` file would get updated automatically.
It will also generate `diff.txt` file in the same folder, marking differences between the two files in a player-readable format (useful for generating changelogs). 
