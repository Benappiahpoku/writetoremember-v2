# Version Control Tags

git tag -a stratonea-frontend-starter-v1.0 -m "Stable version 1.0"

## Check Tags

git tag

## Send all Tags

git push origin --tags

## Deleting Branches

<!-- show available branches -->
git branch  

 <!-- move to main -->
git checkout main

<!-- delete branch locally -->
git branch -d dev

<!-- delete branch on github -->
git push origin --delete dev

## git ignore
<!-- clear Git’s index and re-track only what should be tracked (per your .gitignore) after git init-->
git rm -r --cached .

<!-- see all currently tracked files -->
git status --ignored

## Deleting git folder

<!-- delete git folder -->
rm -rf .git
