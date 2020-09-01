#!/bin/bash

# chmod 755 file_name (To provide the permissions)

# create folders
cd src/assets
mkdir scss
cd scss
mkdir abstracts base components layout

# create one main global file
touch main.scss

# creating files
cd abstracts
touch _functions.scss _mixins.scss _variables.scss
cd ..
cd base
touch _animations.scss _base.scss _typography.scss _utilities.scss
cd ..
cd components
touch _button.scss _card.scss _form.scss
cd ..
cd layout
touch _navigation.scss _pagination.scss
