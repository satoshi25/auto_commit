# git_command.sh
GitDir="$HomeDir$GitRep"

cd $GitDir
git add .
git commit -m "B $MESSAGE"
# git push origin master