#!/bin/bash
for i in {1..30};
do
convert $i.jpg -thumbnail 400x100 -write th_400_$i.jpg
done
