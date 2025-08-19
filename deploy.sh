#zero downtime deployment nextjs without vercel

echo "Deploy starting..."

git pull

npm install || exit

BUILD_DIR=build npm run build || exit

if [ ! -d "build" ]; then
  echo '\033[31m build Directory does not exists!\033[0m'  
  exit 1;
fi

rm -rf .next

mv build .next

pm2 reload provable --update-env

echo "Deploy done."

#make sure `next.config.js` it set `distDir: process.env.BUILD_DIR`