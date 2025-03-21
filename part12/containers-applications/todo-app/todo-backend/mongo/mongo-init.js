db.createUser({
  user: "the_username", // Load credentials from env for real apps
  pwd: "the_password",
  roles: [
    {
      role: "dbOwner",
      db: "the_database",
    },
  ],
});

db.createCollection("todos");

db.todos.insert({ text: "Write code", done: true });
db.todos.insert({ text: "Learn about containers", done: false });
