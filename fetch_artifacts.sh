#!/usr/bin/env bash

set -euo pipefail
set -x

tmpdir=$(mktemp --directory --quiet)

git clone --single-branch --branch built git@github.com:cits3007/cits3007-materials.git $tmpdir

mkdir -p assets/{lectures,workshops,labs,assignments}

cp -a $tmpdir/lectures/*pdf assets/lectures/
cp -a $tmpdir/lectures-markdown/*md assets/lectures/
#cp -a $tmpdir/workshops/*.{pdf,md,zip} assets/workshops/
cp -a $tmpdir/labs/*.{html,md,zip} assets/labs/ || true
cp -a $tmpdir/assignments/*.{pdf,md} assets/assignments/ || true

rm -rf $tmpdir

