# selfjs

**selfjs** is your go-to library for fast, efficient, and powerful Discord selfbotting. Designed with user-specific data and functionality in mind, selfjs is built to handle everything you need with speed and precision. Whether you're looking to automate tasks, manage your user data, or simply wan tto enhance your experience with your own touch, selfjs is there for you. 

## Why use selfjs?
- 🛠️ **Robust Functionality**: Packed with features tailored for selfbotting, giving you complete control over your Discord account.
- 🔒 **User-Centric**: Built with a focus on user-specific data, ensuring you get the most out of your selfbot experience.

## Installation
```bash
npm install @uncutdev/selfjs
```

## Usage 

```mjs
import { Client, Events} from '@uncutdev/selfjs';

const self = new Client('TOKEN');

self.on(Events.READY, () => {
  
})
self.connect();
```