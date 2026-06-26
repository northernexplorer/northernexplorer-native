#!/usr/bin/env bash

SOURCE=${BASH_SOURCE[0]}
while [ -L "$SOURCE" ]; do # resolve $SOURCE until the file is no longer a symlink
  DIR=$( cd -P "$( dirname "$SOURCE" )" >/dev/null 2>&1 && pwd )
  SOURCE=$(readlink "$SOURCE")
  [[ $SOURCE != /* ]] && SOURCE=$DIR/$SOURCE # if $SOURCE was a relative symlink, we need to resolve it relative to the path where the symlink file was located
done
DIR=$( cd -P "$( dirname "$SOURCE" )/.." >/dev/null 2>&1 && pwd )

LCYAN='\033[1;36m'
NC='\033[0m'

source "$DIR/dev/lib/yaklib.sh"

show_help () {
  printf "${LCYAN}Yakuake Script${NC}\n\n"
  printf "Usage:  yak.sh [COMMAND]\n\n"
	printf "A helper script for opening dev environments in yakuake\n\n"
	printf "Commands:\n"
	printf "  default     Runs everything\n"
	printf "  --close             Close all tabs starting with the word Northern Explorer\n"
	printf "  --exit             Close all tabs starting with the word Northern Explorer\n"
	printf "  --core              Build/run core packages: server, web\n"
	printf "\n"
}

all () {
  core
  app
}

core () {
  local tid

  tid=$(newTabWithNamePath "Northern Explorer - Expo" "$DIR/apps/native")
  runCommand "$tid" "nvm use && yarn start"

  tid=$(newTabWithNamePath "Northern Explorer - Server" "$DIR/apps/domain")
  runCommand "$tid" "nvm use && yarn start:server"
}

app () {
  local tid

  tid=$(newTabWithNamePath "Northern Explorer - Android" "$DIR/apps/native")
  runCommand "$tid" "nvm use && EXPO_NO_METRO=true yarn android"
}

close () {
  local sessions
  getSessions sessions
  for el in "${sessions[@]}"; do
    closeTabIfNameMatches "$el" "^Northern Explorer.*"
  done
}

case "$1" in
  "--core")
    core
    exit 0;
  ;;
  "--close")
    close
    exit 0;
  ;;
  "--exit")
    close
    exit 0;
  ;;
  "--help")
    show_help
    exit 0;
  ;;
  *)
    all
  ;;
esac
