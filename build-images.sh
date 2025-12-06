#!/bin/bash

echo "Building MERN Backend Image..."
docker build -t mern-backend ./server

echo ""
echo "Building MERN Frontend Image..."
docker build -t mern-frontend ./client

echo ""
echo "Build Complete! Listing Docker Images:"
echo ""
docker images
