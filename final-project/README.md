# The HyperSpace Library 

### Alexis Guzman - frontend, database
### Liza Tulyankina - backend, UI

## Requirements:

### Must have user accounts and different user roles (like user/Admin, free/paid, etc)

- Premium users get tailored recommendations based on their reading history and likes. Standard users can comment and like books.

### Must use a database (you choose)

- PostgreSQL for relational data structure (reviews, users, books); Hosted on Neon.

### Must have interactive UI (of any kind)

- Book search, review posting, likes, and recommendation sections.

### Must use a library or framework not discussed/used in class

- Tailwind CSS

### Must use an outside REST API in some way (Outside as in external, like the Reddit API, etc)

- Google Books API has data on more than thousands of books

### User story/Use case:

The HyperSpace Library is an interactive reading list that allows users to browse books and track books they’ve read. The user will login as either basic or premium user. If the user is basic, they will be able to look up books, add it to their liked books, and comment on the book. If the user is premium, they can do the same thing but they will also be able to look at their recommendations tab that will give them additional books based on their liked books. 

### Tech Stack: 

Next.js, Node.js, PostgreSQL, Google Books API, JWT for user authentication.

### How to run
- npm install pg
- npm install jsonwebtoken cookies
- npm install axios
- npm install -D tailwindcss postcss autoprefixer

### Keys

- GOOGLE_BOOKS_API_KEY=AIzaSyCLJbEwP-hNUEgTaWirLqfJaWZvOnOS1eM
- JWT_SECRET=my$ecretKey@2024*RandomString
- POSTGRES_HOST=ep-purple-cherry-a57wldf3.us-east-2.aws.neon.tech
- POSTGRES_PORT=5432
- POSTGRES_DBNAME=hyperspace_library
- POSTGRES_USERNAME=hyperspace_library_owner
- POSTGRES_PASSWORD=dc6WsHPMU2Ao

