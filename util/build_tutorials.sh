#==========================================
#            TUTORIAL BUILDER             #
#==========================================

# TESTED ON MAC OS X - 10.10.5

### REQUIRES ####

# Ruby installed
# Jekyll installed 
    #$ gem install jekyll

# Remove any old things
rm -rf ./build/tutorials

rm -rf ./build/assets

# Copy over assets
cp -r ../assets ./build/assets

# Copy over the tutorials
cp -r ../tutorials ./build/tutorials

for f in $(find ./build/tutorials -name "*.md")
do
  if [[ $f == *.md ]]
  then
    echo '' | cat - $f > temp && mv temp $f
    echo '---' | cat - $f > temp && mv temp $f
    echo 'title: abc' | cat - $f > temp && mv temp $f
    echo 'layout: page' | cat - $f > temp && mv temp $f
    echo '---' | cat - $f > temp && mv temp $f
  fi
done

#Build the tutorials
jekyll build -s ./build -d ./build/_site

# After building the site we're going to need to fix a few things:
  # Image Links
  # Curly quotes

# Get current Branch
BRANCH=$(git rev-parse --abbrev-ref HEAD)

# Replace all image links and bad (curly) quotes
for f in $(find ./build/_site -name "*.html")
do
  if [[ $f == *.html ]]
  then
    sed -i '.bak' "s/src=\"\/assets\//src=\"https:\/\/raw.githubusercontent.com\/ZacBlanco\/hwx-tutorials\/$BRANCH\/assets\//g" $f
    sed -i '' "s/‘/'/g" $f
    sed -i '' "s/’/'/g" $f
    sed -i '' "s/\”/\"/g" $f
    sed -i '' "s/\“/\"/g" $f
#    [‘|’|“|”]
  fi
done