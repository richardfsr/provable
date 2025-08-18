This is the repository for [Provable Art](https://provable.art) which is a simple digital art gallery for Solana.

It supports the following functionality:

- Log-in using your Solana wallet
- Fetches the NFT's in your wallet
- Let's you set a username
- Let's you use drag and drop to choose which items to hide and to order the rest

TODO:

- Add additional wallets

Screenshot:

![Screenshot](/public/images/screenshot.png?raw=true "Screenshot")

## Getting Started

Run the development server:

```bash
npm install
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.

## Dependencies

This project uses Nextjs, React, MongoDB, Tailwind CSS

You need to setup the following local variables:

```
NEXT_PUBLIC_NETWORK=
NEXT_PUBLIC_RPC_SERVER=
NEXT_PUBLIC_DB_URI=
```

## Contributing

Feel free to raise any issues using GitHub issues and to fork this project and submit pull requests if you'd like to add features.
