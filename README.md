# append-er

NodeJS based CLI application to read from a provided file and combine its information with data from an API and output a new file.


# Pre-requisites

|Tool| Version  |
|--|--|
| Node | >= 10 < 11|
| NPM | >= 6 |


# Setting Up
- Run `npm install` from the project directory to update the dependencies
- Once dependencies are installed, run `npm link` from the project directory. This will link a new CLI command in your enviornment `appndr`.  Linking will allow you to run the CLI app from your Terminal and from any directory

# Running
- Run `appndr` from any location in your Terminal

> Usage: appndr [options] [command]
>
> Options:   -v, --version   output the version number   -h, --help     
> display help for command
>
> Commands:
>
>| commands | description |
>|--|--|
>| config | configure environment |
>| parse | parse a file for processing |
>| help [command] | display help for command |

## Setting up environment config
- Run `appndr config --init` to set up a new environment. Environment config are stored as a JSON file in `$HOME/.config/configstore`
- Run `appndr config --reset` to reset the configuration data. If no configuration is found when running the `appndr parse` command, it will default to **Development** config.

## Reading a file and outputting another
- Run `appndr parse --in $HOME/input.csv --out $HOME/output.csv` to read a CSV file. The CLI app only support CSV files a the moment. When a file that is not a csv file for passed in the `--in` or `--out` options, it will out `Error: File type is not supported`

