#!/usr/bin/bash
rm -rf ./__coverage__;
mkdir ./__coverage__;
cp ./packages/client/__coverage__/coverage-final.json ./__coverage__/coverage-final-front.json;
cp ./packages/server/__coverage__/coverage-final.json ./__coverage__/coverage-final-back.json;
npx nyc merge ./__coverage__ ./__coverage__/final-coverage.json
