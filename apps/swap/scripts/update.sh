# !/bin/bash
level=${1:-"c"}

cur_version=$(jq -r .version package.json)

version=$cur_version

array=(${cur_version//./ })

a=""
b=""
c=""

if [ $level = "a" ]
then
  a=$[${array[0]} + 1]
  b="0"
  c="0"
elif [ $level = "b" ]
then
  a=${array[0]}
  b=$[${array[1]} + 1]
  c="0"
else
  a=${array[0]}
  b=${array[1]}
  c=$[${array[2]} + 1]
fi

version="${a}.${b}.${c}"
v_version=v$version

echo "version: ${version}"

npm version $version

git push

git tag -d $v_version

git tag -a $v_version -m "$version"

git push origin $v_version
